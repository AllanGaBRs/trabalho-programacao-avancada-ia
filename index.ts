// 1. Contrato de cobrança separado da IA
interface IServicoCobranca {
    cobrar(usuarioId: string, valorTokens: number): void;
}

class SistemaCobrancaStripe implements IServicoCobranca {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

// 2. Interface "Faz-Tudo"
interface IModelosIA {
    gerarTexto(prompt: string): string;
    gerarImagem(prompt: string): string;
    gerarAudio(prompt: string): string;
}

// 3. A classe principal que gerencia tudo
class AssistenteOmniIA implements IModelosIA {
    public nomeModelo: string;
    private servicoCobranca: IServicoCobranca;

    constructor(nomeModelo: string, servicoCobranca: IServicoCobranca) {
        this.nomeModelo = nomeModelo;
        this.servicoCobranca = servicoCobranca;
    }

    // Processador central cheio de condicionais
    processarRequisicaoUsuario(prompt: string, tipo: string, usuarioId: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        if (tipo === "TEXTO") {
            this.gerarTexto(prompt);
        } else if (tipo === "IMAGEM") {
            this.gerarImagem(prompt);
        } else if (tipo === "AUDIO") {
            this.gerarAudio(prompt);
        } else {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }
       
        this.servicoCobranca.cobrar(usuarioId, 1.50);
    }

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }

}

// 4. Um modelo específico sendo forçado a herdar o que não deve
class ModeloFocadoEmTexto extends AssistenteOmniIA {
    constructor() {
        super("ChatGPT-4", new SistemaCobrancaStripe());
    }

    gerarImagem(prompt: string): string {
        throw new Error("Falha Crítica: O ChatGPT-4 não gera imagens nativamente nesta versão.");
    }

    gerarAudio(prompt: string): string {
        throw new Error("Falha Crítica: Modelo de texto não pode gerar arquivos de áudio.");
    }
}
