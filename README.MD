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
- **Runtime em Background**: Execução contínua com PM2

## 🔧 Pré-requisitos

- Node.js (versão 16 ou superior)
- Bun (recomendado) ou npm
- PM2 (para execução em background)
- Conta OpenAI com API key
- WhatsApp Web
- ffmpeg-static (incluído automaticamente)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd botai-zap
```

2. Instale as dependências:
```bash
bun install
# ou
npm install
```

3. Instale o PM2 globalmente:
```bash
bun add -g pm2
# ou
npm install -g pm2
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
FILE_DATA_PATH='./src/logs/whatsappAuth' // Local personalizável.
```

## 🎯 Uso

### Execução Simples (Desenvolvimento)

```bash
bun start
# ou
npm start
```

### Execução em Background com PM2 (Produção)

1. **Iniciar o bot em background:**
```bash
bun run startpm2
```

2. **Para visualizar os logs e escanear o QR code:**
```bash
bun run logspm2
```

3. **Outros comandos PM2 disponíveis:**
```bash
# Parar o bot
bun run stoppm2

# Reiniciar o bot
bun run restartpm2

# Verificar status
bun run statuspm2

# Ver logs
bun run logspm2
```

> **⚠️ Importante**: Ao executar com PM2, você precisará usar o comando `bun run logspm2` para visualizar o QR code na primeira configuração.

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

## 🚀 Melhorias de Performance

- **Removido Docker**: A configuração Docker foi removida pois estava impactando negativamente na performance da aplicação
- **QR Code Otimizado**: Substituído o módulo QRCode pelo `qrcode-terminal`, específico para terminais e mais eficiente
- **PM2 Integration**: Runtime em background com PM2 para melhor estabilidade e gerenciamento de processos

## 🔒 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## ⚠️ Avisos

- Este projeto utiliza a API da OpenAI, que tem custos associados
- Mantenha suas chaves de API seguras
- Use responsavelmente e respeite os termos de serviço
- Para execução em produção, recomenda-se o uso do PM2