# 🤖 WhatsApp Bot AI

Um bot inteligente para WhatsApp que utiliza a API da OpenAI para conversas naturais, processamento de comandos e transcrição de áudio.

## 📋 Descrição

Este projeto implementa um assistente virtual no WhatsApp capaz de:
- Manter conversas contextuais usando GPT
- Processar comandos específicos (/help, /stats, etc.)
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

- `/help` - Mostra todos os comandos disponíveis
- `/stats` - Exibe estatísticas do bot
- `/clear` - Limpa o histórico de conversa
- `/tokens` - Mostra estatísticas de tokens
- `/reset_tokens` - Reseta contador de tokens
- `/ping` - Testa se o bot está respondendo
- `/weather [cidade]` - Consulta clima
- `/translate [língua] [texto]` - Tradução
- `/summarize [texto]` - Resumo de texto
- `/joke` - Conta uma piada
- `/quote` - Gera frase motivacional
- `/math [expressão]` - Calculadora
- `/define [termo]` - Definição
- `/news [tópico]` - Notícias
- `/recipe [ingredientes]` - Receitas
- `/workout [tipo]` - Sugestões de treino
- `/reminder [lembrete]` - Criar lembrete
- `/facts [tópico]` - Fatos interessantes
- `/code [descrição]` - Ajuda com programação
- `/study [tópico]` - Ajuda com estudos

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
│   └── fluent-ffmpeg.d.ts    # Tipos TypeScript
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