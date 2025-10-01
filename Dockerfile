# Use Bun como runtime base
FROM oven/bun:1-alpine

# Instala dependências do sistema necessárias para WhatsApp Web
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Define variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package.json bun.lockb* ./

# Instala dependências usando Bun
RUN bun install --frozen-lockfile

# Copia código fonte
COPY . .

# Cria diretório para logs e sessões
RUN mkdir -p /app/src/logs/whatsappAuth

# Define usuário não-root para segurança
RUN addgroup -g 1001 -S bunuser
RUN adduser -S bunuser -u 1001
RUN chown -R bunuser:bunuser /app
USER bunuser

# Define comando de inicialização usando Bun
CMD ["bun", "run", "start"]