FROM oven/bun:1-alpine

# Instala só o que precisa para WhatsApp Web
RUN apk add --no-cache \
    chromium \
    && rm -rf /var/cache/apk/*

# Configurações para Chromium funcionar em container
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_ARGS="--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage"

WORKDIR /app
COPY package.json .
RUN bun install --production
COPY . .

# Cria usuário não-root para Chromium
RUN addgroup -g 1001 -S bunuser && adduser -S bunuser -u 1001
RUN chown -R bunuser:bunuser /app

USER bunuser

CMD ["bun", "start"]

# Define comando de inicialização usando Bun
CMD ["bun", "run", "start"]