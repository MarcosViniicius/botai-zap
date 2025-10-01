# 🤖 WhatsApp Bot AI

Um bot inteligente para WhatsApp que utiliza a API da OpenAI para conversas naturais, processamento de comandos e transcrição de áudio.

## 📋 Descrição

Este projeto implementa um assistente virtual no WhatsApp capaz de:
- Manter conversas contextuais usando GPT
- Processar comandos específicos (/stats, etc.)
- Transcrever mensagens de áudio
- Gerar respostas em áudio
- Acelerar áudio para melhor processamento

## ✨ Funcionalidades

- **Chat Inteligente**: Conversas naturais com histórico mantido
- **Comandos Especiais**: Diversos comandos para funcionalidades extras
- **Processamento de Áudio**: Transcrição e resposta em áudio
- **Histórico de Conversa**: Mantém contexto entre mensagens
- **Debug de Tokens**: Monitoramento de uso da API OpenAI

## 🔧 Pré-requisitos

- Node.js (versão 16 ou superior)
- Bun (recomendado) ou npm
- Conta OpenAI com API key
- WhatsApp Web
- ffmpeg-static (incluído automaticamente)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd type
```

2. Instale as dependências:
```bash
bun install
# ou
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis no `.env`:
```env
APIKEY=sua-api-key-openai-aqui
DEBUG_TOKENS=false
MAX_HISTORY_LENGTH=20
```

## 🎯 Uso

1. Execute o bot:
```bash
bun start
# ou
npm start
```

2. No primeiro acesso, um QR code será exibido no terminal
3. Escaneie o QR code com o WhatsApp Web
4. O bot estará pronto para uso!

## 📝 Comandos Disponíveis

- `/stats` - Exibe estatísticas do bot


## 🧪 Desenvolvimento

### Executar Testes

```bash
bun run test
# ou
npm test
```

### Build

```bash
bun run build
# ou
npm run build
```

### Desenvolvimento

```bash
bun run dev
# ou
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── services/
│   ├── openaiService.ts      # Integração com OpenAI
│   ├── whatsappService.ts    # Lógica do WhatsApp
│   └── chatCommands.ts       # Processamento de comandos
├── models/
│   ├── historyModel.ts       # Gerenciamento de histórico
│   ├── tokenDebugModel.ts    # Debug de tokens
│   └── accelerateAudioModel.ts # Processamento de áudio
├── types/
│   └── ffmpeg-static.d.ts    # Tipos TypeScript para ffmpeg-static
└── tests/                    # Testes automatizados
```

## 🔒 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## ⚠️ Avisos

- Este projeto utiliza a API da OpenAI, que tem custos associados
- Mantenha suas chaves de API seguras
- Use responsavelmente e respeite os termos de serviço