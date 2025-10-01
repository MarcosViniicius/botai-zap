# Docker Setup - Bot AI WhatsApp (com Bun)

Este projeto usa **Bun** como runtime, que já inclui FFmpeg embutido para processamento de áudio.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Configuração Rápida

1. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.docker .env
   ```
   
   Edite o arquivo `.env` e configure sua chave da API OpenAI:
   ```bash
   apiKey=sua_chave_openai_aqui
   ```

2. **Execute o projeto:**
   ```bash
   # Inicia o bot
   docker-compose up -d
   
   # Visualiza logs (incluindo QR Code do WhatsApp)
   docker-compose logs -f botai-zap
   ```

3. **Escaneie o QR Code** que aparecerá nos logs para conectar ao WhatsApp

## Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Reconstruir após mudanças no código
docker-compose build

# Parar o bot
docker-compose down

# Entrar no container para debug
docker-compose exec botai-zap sh

# Executar comandos Bun dentro do container
docker-compose exec botai-zap bun --version
```

## Vantagens do Bun

- ✅ **FFmpeg incluído** - Não precisa instalar separadamente
- ✅ **Startup mais rápido** - Runtime otimizado
- ✅ **Menor uso de memória**
- ✅ **Compatível com Node.js** - Todas as dependências funcionam

## Volumes Persistentes

- `./src/logs/whatsappAuth`: Mantém a sessão do WhatsApp autenticada
- `./src/logs`: Logs gerais da aplicação

## Troubleshooting

1. **QR Code não aparece:**
   ```bash
   docker-compose logs -f botai-zap
   ```

2. **Erro de permissões:**
   ```bash
   sudo chown -R $USER:$USER ./src/logs/
   ```

3. **Reautenticar WhatsApp:**
   ```bash
   # Remove dados de sessão e reinicia
   rm -rf ./src/logs/whatsappAuth/session/*
   docker-compose restart
   ```

## Desenvolvimento

Para desenvolvimento local, monte o código fonte:

1. Modifique o `docker-compose.yml` adicionando:
   ```yaml
   volumes:
     - .:/app
     - /app/node_modules
   ```

2. Execute em modo desenvolvimento:
   ```bash
   docker-compose exec botai-zap bun run dev
   ```