// 1. Contrato de pagamento separado das implementações concretas
interface IServicoPagamento {
    cobrar(usuarioId: string, valorTokens: number): void;
}

class SistemaCobrancaStripe implements IServicoPagamento {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

class SistemaCobrancaPayPal implements IServicoPagamento {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via PayPal do usuário ${usuarioId}`);
    }
}

class SistemaCobrancaPix implements IServicoPagamento {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Pix do usuário ${usuarioId}`);
    }
}

// 2. Contratos pequenos e coesos para cada capacidade de IA
interface IProcessadorIA {
    tipo: string;
    processar(prompt: string): string;
}

interface IGeradorTexto {
    gerarTexto(prompt: string): string;
}

interface IGeradorImagem {
    gerarImagem(prompt: string): string;
}

interface IGeradorAudio {
    gerarAudio(prompt: string): string;
}

class GeradorTexto implements IProcessadorIA, IGeradorTexto {
    tipo = "TEXTO";

    processar(prompt: string): string {
        return this.gerarTexto(prompt);
    }

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements IProcessadorIA, IGeradorImagem {
    tipo = "IMAGEM";

    processar(prompt: string): string {
        return this.gerarImagem(prompt);
    }

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements IProcessadorIA, IGeradorAudio {
    tipo = "AUDIO";

    processar(prompt: string): string {
        return this.gerarAudio(prompt);
    }

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

// 3. A classe principal orquestra serviços sem conhecer cada tipo de IA
class AssistenteOmniIA {
    public nomeModelo: string;
    private servicoPagamento: IServicoPagamento;
    private processadores: { [tipo: string]: IProcessadorIA };

    constructor(nomeModelo: string, servicoPagamento: IServicoPagamento, processadores: IProcessadorIA[]) {
        this.nomeModelo = nomeModelo;
        this.servicoPagamento = servicoPagamento;
        this.processadores = {};

        processadores.forEach((processador) => {
            this.processadores[processador.tipo] = processador;
        });
    }

    processarRequisicaoUsuario(prompt: string, tipo: string, usuarioId: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const processador = this.processadores[tipo];

        if (!processador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        processador.processar(prompt);
        this.servicoPagamento.cobrar(usuarioId, 1.50);
    }

}

// 4. Um modelo específico não herda de um assistente com capacidades mais amplas
class ModeloFocadoEmTexto {
    private assistente: AssistenteOmniIA;

    constructor(servicoPagamento: IServicoPagamento) {
        this.assistente = new AssistenteOmniIA(
            "ChatGPT-4",
            servicoPagamento,
            [new GeradorTexto()]
        );
    }

    processarTexto(prompt: string, usuarioId: string): void {
        this.assistente.processarRequisicaoUsuario(prompt, "TEXTO", usuarioId);
    }
}
