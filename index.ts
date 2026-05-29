// 1. Contrato de cobrança separado da IA
interface IServicoCobranca {
    cobrar(usuarioId: string, valorTokens: number): void;
}

class SistemaCobrancaStripe implements IServicoCobranca {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

// 2. Contrato aberto para novos tipos de geração
interface IGeradorIA {
    tipo: string;
    gerar(prompt: string): string;
}

class GeradorTexto implements IGeradorIA {
    tipo = "TEXTO";

    gerar(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements IGeradorIA {
    tipo = "IMAGEM";

    gerar(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements IGeradorIA {
    tipo = "AUDIO";

    gerar(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

// 3. A classe principal orquestra serviços sem conhecer cada tipo de IA
class AssistenteOmniIA {
    public nomeModelo: string;
    private servicoCobranca: IServicoCobranca;
    private geradores: { [tipo: string]: IGeradorIA };

    constructor(nomeModelo: string, servicoCobranca: IServicoCobranca, geradores: IGeradorIA[]) {
        this.nomeModelo = nomeModelo;
        this.servicoCobranca = servicoCobranca;
        this.geradores = {};

        geradores.forEach((gerador) => {
            this.geradores[gerador.tipo] = gerador;
        });
    }

    processarRequisicaoUsuario(prompt: string, tipo: string, usuarioId: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const gerador = this.geradores[tipo];

        if (!gerador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        gerador.gerar(prompt);
        this.servicoCobranca.cobrar(usuarioId, 1.50);
    }

}

// 4. Um modelo específico registra apenas as capacidades que oferece
class ModeloFocadoEmTexto extends AssistenteOmniIA {
    constructor() {
        super("ChatGPT-4", new SistemaCobrancaStripe(), [
            new GeradorTexto()
        ]);
    }
}
