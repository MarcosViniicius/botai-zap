FROM oven/bun:1-alpine

# Instala só o que precisa para WhatsApp Web
RUN apk add --no-cache \
    chromium \
    && rm -rf /var/cache/apk/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package.json .
RUN bun install --production
COPY . .

CMD ["bun", "start"]

# Define comando de inicialização usando Bun
CMD ["bun", "run", "start"]