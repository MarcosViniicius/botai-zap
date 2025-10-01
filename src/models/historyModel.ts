import { getTokenStats, resetTokenCounter} from '../models/tokenDebugModel';


// Histórico de conversação por usuário/grupo
type ConversationMessage = { role: "user" | "assistant"; content: string };
const conversationHistories: Map<string, ConversationMessage[]> = new Map();

// Limite máximo de mensagens por histórico para controlar tokens
const MAX_HISTORY_LENGTH = parseInt(process.env.MAX_HISTORY_LENGTH || '20');

// Função para obter ou criar histórico de um usuário
export function getOrCreateHistory(userId: string): ConversationMessage[] {
  if (!conversationHistories.has(userId)) {
    conversationHistories.set(userId, []);
  }
  return conversationHistories.get(userId)!;
}

// Função para manter o histórico dentro do limite
export function trimHistory(history: ConversationMessage[]): ConversationMessage[] {
  if (history.length > MAX_HISTORY_LENGTH) {
    // Remove as mensagens mais antigas, mantendo as mais recentes
    return history.slice(-MAX_HISTORY_LENGTH);
  }
  return history;
}

export function addUserMessage(userId: string, text: string) {
  const history = getOrCreateHistory(userId);
  history.push({ role: "user", content: text });
  // Aplica o limite de histórico
  const trimmedHistory = trimHistory(history);
  conversationHistories.set(userId, trimmedHistory);
}

export function addAssistantMessage(userId: string, text: string) {
  const history = getOrCreateHistory(userId);
  history.push({ role: "assistant", content: text });
  // Aplica o limite de histórico
  const trimmedHistory = trimHistory(history);
  conversationHistories.set(userId, trimmedHistory);
}

 function clearHistory(userId?: string) {
  if (userId) {
    conversationHistories.delete(userId);
  } else {
    conversationHistories.clear();
  }
}

// Função para obter estatísticas de histórico
export function getHistoryStats() {
  const stats = {
    totalUsers: conversationHistories.size,
    userStats: {} as Record<string, number>
  };
  
  conversationHistories.forEach((history, userId) => {
    stats.userStats[userId] = history.length;
  });
  
  return stats;
}

// Exporta funções
export { clearHistory, getTokenStats, resetTokenCounter };