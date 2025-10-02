import { Client, LocalAuth } from 'whatsapp-web.js';
import { setupBot } from './src/services/whatsappService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Inicializa o cliente do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({ 
    dataPath: process.env.FILE_DATA_PATH 
      ? path.resolve(process.env.FILE_DATA_PATH) 
      : path.resolve(__dirname, './src/logs/whatsappAuth') // Caminho absoluto
  }),
  puppeteer: {
    headless: true, // melhor para servidores
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-background-networking',
      '--disable-infobars',
      '--disable-extensions',
      '--disable-default-apps',
      '--mute-audio'
    ],
    ignoreDefaultArgs: ['--enable-automation'] // evita revelar automação ao WhatsApp Web
  }
});

// Configura todas as funcionalidades do bot
setupBot(client);

// Inicializa o cliente
client.initialize();


//pm2 start nome-do-arquivo.js --name nome-do-processo
