import dotenv from 'dotenv';

dotenv.config();

// Configuração de debug
const DEBUG_TOKENS = process.env.DEBUG_TOKENS === 'true';

// Contador de tokens acumulado
let totalTokensUsed = 0;

// Tipo para dados de uso de tokens
interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

// Função para debug de tokens
export function debugTokens(functionName: string, usage: TokenUsage | undefined, model: string, historyLength?: number) {
  if (!DEBUG_TOKENS) return;

  const promptTokens = usage?.prompt_tokens ?? 0;
  const completionTokens = usage?.completion_tokens ?? 0;
  const totalTokens = usage?.total_tokens ?? 0;
  const timestamp = new Date().toISOString();

  totalTokensUsed += totalTokens;

  console.log(`\n🔍 [TOKEN DEBUG] ${timestamp} ================================`);
  console.log(`📍 Função       : ${functionName}`);
  console.log(`🤖 Modelo      : ${model}`);
  console.log(`📝 Tokens prompt: ${promptTokens}`);
  console.log(`💬 Tokens resposta: ${completionTokens}`);
  console.log(`🔢 Total chamada: ${totalTokens}`);
  if (historyLength !== undefined) {
    console.log(`🗂️ Mensagens no histórico: ${historyLength}`);
  }
  console.log(`📊 Total acumulado: ${totalTokensUsed}`);
  console.log('===========================================================\n');
}

// Função para obter estatísticas de tokens
export function getTokenStats() {
  return {
    totalTokensUsed,
    debugEnabled: DEBUG_TOKENS
  };
}

// Função para resetar contador de tokens
export function resetTokenCounter() {
  totalTokensUsed = 0;
  if (DEBUG_TOKENS) {
    console.log('🔄 Contador de tokens resetado');
  }
}

// Função para debug específico de transcrição (sem tokens de resposta)
export function debugTranscription(functionName: string, audioSize: number, duration?: number) {
  if (!DEBUG_TOKENS) return;
  
  const timestamp = new Date().toISOString();

  console.log(`\n🔍 [AUDIO DEBUG] ${timestamp} ================================`);
  console.log(`📍 Função       : ${functionName}`);
  console.log(`🎵 Tamanho áudio: ${audioSize} bytes`);
  if (duration !== undefined) {
    console.log(`⏱️ Duração      : ${duration}s`);
  }
  console.log('===========================================================\n');
}

// Função para debug de síntese de voz
export function debugSpeechSynthesis(functionName: string, textLength: number, audioSize?: number) {
  if (!DEBUG_TOKENS) return;
  
  const timestamp = new Date().toISOString();

  console.log(`\n🔍 [SPEECH DEBUG] ${timestamp} ===============================`);
  console.log(`📍 Função       : ${functionName}`);
  console.log(`📝 Tamanho texto: ${textLength} caracteres`);
  if (audioSize !== undefined) {
    console.log(`🎵 Tamanho áudio: ${audioSize} bytes`);
  }
  console.log('===========================================================\n');
}
