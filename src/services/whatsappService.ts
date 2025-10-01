import { Client,Message } from 'whatsapp-web.js';
import { 
  generateAudioTextGpt, 
  generateTextGpt, 
  generateAudioTranscriptionGpt, 
  generateSpeechToTextGpt,
} from './openaiService';
import {getHistoryStats} from '../models/historyModel';
import QRCode from 'qrcode';
import { accelerateAudioBuffer } from '../models/accelerateAudioModel';
import fs from "fs";


// Map guarda o timestamp da ativação para controlar mensagens antigas
const userChatState: Map<string, number> = new Map(); // userId, timestampAtivacao
const userAudioState: Map<string, number> = new Map(); // userId, timestampAtivacao


// Função para processar mensagens de áudio
async function processAudioMessage(msg: Message, audioBuffer: Buffer, userId: string): Promise<void> {
  try {
    // Transcrever o áudio original
    const transcribedText = await generateAudioTranscriptionGpt(audioBuffer);

    // Gerar resposta textual da AI usando histórico do usuário
    const contextualAnswer = await generateAudioTextGpt(transcribedText, userId);

    // Gerar áudio de resposta (geralmente MessageMedia)
    const audioMedia = await generateSpeechToTextGpt(contextualAnswer);

    // Envia resposta em áudio
    await msg.reply(audioMedia, undefined, { sendAudioAsVoice: true });
  } catch (error) {
    console.error('Erro ao processar mensagem de áudio:', error);
  }
}

// Configura todas as funcionalidades do bot
export function setupBot(client: Client): void {
    // Evento QR Code
  client.on('qr', (qr: string | undefined) => {
    if (!qr) {
      console.log("No QR code received");
      return;
    }
    
    QRCode.toString(qr, { type: 'terminal', small: true }, function (err, url) {
      if (err) {
        console.error('Erro ao gerar QR code:', err);
        return;
      }
      console.log(url);
    });
  });

  // Evento quando o cliente está pronto
  client.on('ready', () => {
    console.log('Bot está rodando!');
  });

  // Evento quando uma nova mensagem é recebida
  client.on('message', async (msg: Message) => {
    const speed = 2.0; // Velocidade de aceleração do áudio
    try {
      const userId = msg.author || msg.from;
      const timestamp = msg.timestamp;
      const text = (msg.body || '').trim();

      // Processa apenas mensagens de áudio
      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        const audioBuffer = Buffer.from(media.data, 'base64');
        const audioBufferAcelerated = await accelerateAudioBuffer(audioBuffer, speed);

        // CASO QUEIRA SALVAR O ÁUDIO ACELERADO
        // fs.writeFileSync("audio_acelerado.ogg", audioBufferAcelerated);
        console.log("Áudio acelerado salvo.");
        await processAudioMessage(msg, audioBufferAcelerated, userId);
        return;
      }

      // Comandos especiais
      if (text.toLowerCase() === '/stats') {
        const stats = getHistoryStats();
        const statsMessage = `📊 **Estatísticas do Bot**\n\n👥 Total de usuários: ${stats.totalUsers}\n📝 Mensagens por usuário:\n${Object.entries(stats.userStats).map(([id, count]) => `• ${id.slice(-10)}: ${count} mensagens`).join('\n')}`;
        await msg.reply(statsMessage);
        return;
      }

      // Processa apenas mensagens de texto
      if (text) {
        const chatReply = await generateTextGpt(text, userId);
        await msg.reply(`${chatReply}`);
        return;
      }

    } catch (error) {
      console.error('Erro ao responder a mensagem:', error);
    }
  });

    // Evento de falha na autenticação
  client.on('auth_failure', (msg: string) => {
    console.error('AUTHENTICATION FAILURE', msg);
  });

  // Evento quando o cliente é desconectado
  client.on('disconnected', (reason: string) => {
   console.log('Client was logged out', reason);
  });

}

