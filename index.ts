import { Client, LocalAuth } from 'whatsapp-web.js';
import { setupBot } from './src/services/whatsappService';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa o cliente do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({ 
    dataPath: process.env.FILE_DATA_PATH || './src/logs/whatsappAuth' // Caminho para armazenar dados de sessão, caso não exista, será criado automaticamente.
    })
});

// Configura todas as funcionalidades do bot
setupBot(client);

// Inicializa o cliente
client.initialize();
