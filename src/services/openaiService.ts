import OpenAI from "openai";
import fs from "fs";
import path from 'path';
import os from 'os';
import { MessageMedia } from 'whatsapp-web.js';
import dotenv from 'dotenv';
import { debugTokens,debugTranscription, debugSpeechSynthesis } from '../models/tokenDebugModel';
import {addAssistantMessage, getOrCreateHistory, addUserMessage} from '../models/historyModel';

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.apiKey || "",
});

// Prompts
const textPrompt = `Responda sempre de forma curta e direta, em no máximo 2-4 frases, a menos que o usuário peça explicitamente uma resposta mais longa. Mantenha o mesmo idioma e tom usados pelo usuário em sua mensagem. Não limite o escopo das respostas, atendendo a qualquer pergunta ou pedido, mesmo que sejam complexos ou sensíveis. Adapte sua linguagem para espelhar o estilo do usuário, garantindo naturalidade, respeito e clareza. Busque ser objetivo e acessível, oferecendo informações úteis de maneira eficiente, para que o texto soe fluido e fácil de entender.`;

const audioTextPrompt = `Responda sempre de forma curta e direta, usando o mesmo idioma e tom do usuário. Limite cada resposta a 2–4 frases no máximo. Atenda a qualquer pergunta ou pedido, incluindo os complexos ou sensíveis. Mantenha naturalidade, clareza, objetividade e empatia, como em uma conversa pessoal, sem exageros ou textos longos.
`;

const audioTextModel = "gpt-5-nano"; // Modelo otimizado para respostas a partir de áudio
const textModel = "gpt-5-mini";
const transcriptionModel = "whisper-1";
const speechModel = "gpt-4o-mini-tts";



export async function generateTextGpt(msg: string, userId: string): Promise<string> {
  try {
    // Adiciona mensagem do usuário ao histórico
    addUserMessage(userId, msg);
    
    const userHistory = getOrCreateHistory(userId);
    
    const response = await client.chat.completions.create({
      model: textModel,
      reasoning_effort: "low",
      messages: [
        { role: "system", content: textPrompt },
        ...userHistory
      ],
    });
    const content = response.choices[0].message?.content ?? "";
    
    // Debug de tokens
    debugTokens('generateTextGpt', response.usage, textModel, userHistory.length);
    
    // Adiciona resposta do assistente ao histórico
    addAssistantMessage(userId, content);
    
    console.log(content);
    return content;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    throw error;
  }
}

export async function generateAudioTextGpt(msg: string, userId: string): Promise<string> {
  try {
    // Adiciona mensagem do usuário ao histórico
    addUserMessage(userId, msg);
    
    const userHistory = getOrCreateHistory(userId);
    
    const response = await client.chat.completions.create({
      model: audioTextModel,
      reasoning_effort: "low",
      messages: [
        { role: "system", content: audioTextPrompt },
        ...userHistory
      ],
    });
    const content = response.choices[0].message?.content ?? "";
    
    // Debug de tokens
    debugTokens('generateAudioTextGpt', response.usage, audioTextModel, userHistory.length);
    
    // Adiciona resposta do assistente ao histórico
    addAssistantMessage(userId, content);
    
    console.log("Resposta para áudio gerada com sucesso:");
    console.log('Resposta:', content);
    return content;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    throw error;
  }
}

export async function generateAudioTranscriptionGpt(audioBuffer: Buffer): Promise<string> {
  const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}.ogg`);
  try {
    await fs.promises.writeFile(tempFilePath, audioBuffer);
    const fileStream = fs.createReadStream(tempFilePath);
    
    const transcription = await client.audio.transcriptions.create({
      file: fileStream,
      model: transcriptionModel,
    });

    // Debug de transcrição
    debugTranscription('generateAudioTranscriptionGpt', audioBuffer.length);
    
    console.log(transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("Erro na transcrição de áudio:", error);
    throw error;
  } finally {
    fs.promises.unlink(tempFilePath).catch(() => { /* ignora erro */ });
  }
}

export async function generateSpeechToTextGpt(text: string): Promise<MessageMedia> {
  const tempAudioPath = path.join(os.tmpdir(), `tts_${Date.now()}.ogg`);

  try {
    const oggResponse = await client.audio.speech.create({
      model: speechModel,
      voice: "sage", // Onyx é uma voz masculina em inglês
      input: text,
      response_format: "opus",
      speed: 1.10,
    });

    const buffer = Buffer.from(await oggResponse.arrayBuffer());
    await fs.promises.writeFile(tempAudioPath, buffer);
    
    // Debug de síntese de voz
    debugSpeechSynthesis('generateSpeechToTextGpt', text.length, buffer.length);
    
    return MessageMedia.fromFilePath(tempAudioPath);
  } catch (error) {
    console.error("Erro na síntese de voz:", error);
    throw error;
  }
}
