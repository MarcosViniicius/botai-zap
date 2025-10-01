import { handleCommand, getAvailableCommands } from '../services/chatCommands';
import { setupBot } from '../services/whatsappService';
import { getOrCreateHistory, addUserMessage, addAssistantMessage, getHistoryStats, clearHistory } from '../models/historyModel';
import { debugTokens, getTokenStats, resetTokenCounter } from '../models/tokenDebugModel';
import { accelerateAudioBuffer } from '../models/accelerateAudioModel';

// Mock do whatsapp-web.js
jest.mock('whatsapp-web.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    on: jest.fn()
  })),
  Message: jest.fn().mockImplementation(() => ({
    body: '',
    author: 'user123',
    from: 'user123',
    timestamp: Date.now(),
    hasMedia: false,
    downloadMedia: jest.fn().mockImplementation(() => Promise.resolve({ data: 'base64data' })),
    reply: jest.fn().mockImplementation(() => Promise.resolve())
  }))
}));

describe('Chat Commands Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAvailableCommands should return array of commands', () => {
    const commands = getAvailableCommands();
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
  });

  it('handleCommand should handle /help', async () => {
    const mockMsg = {
      body: '/help',
      reply: jest.fn().mockImplementation(() => Promise.resolve())
    };
    const result = await handleCommand(mockMsg as any);
    expect(result).toBe(true);
    expect(mockMsg.reply).toHaveBeenCalled();
  });

  it('handleCommand should return false for unknown command', async () => {
    const mockMsg = {
      body: '/unknown',
      reply: jest.fn().mockImplementation(() => Promise.resolve())
    };
    const result = await handleCommand(mockMsg as any);
    expect(result).toBe(false);
  });
});

describe('History Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getOrCreateHistory should return array', () => {
    const history = getOrCreateHistory('user123');
    expect(Array.isArray(history)).toBe(true);
  });

  it('addUserMessage should add message', () => {
    addUserMessage('user123', 'Olá');
    const history = getOrCreateHistory('user123');
    expect(history.length).toBeGreaterThan(0);
  });

  it('getHistoryStats should return stats', () => {
    const stats = getHistoryStats();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('userStats');
  });

  it('clearHistory should clear history for user', () => {
    addUserMessage('user123', 'Test');
    clearHistory('user123');
    const history = getOrCreateHistory('user123');
    expect(history.length).toBe(0);
  });
});

describe('Token Debug Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTokenStats should return stats', () => {
    const stats = getTokenStats();
    expect(stats).toHaveProperty('totalTokensUsed');
    expect(stats).toHaveProperty('debugEnabled');
  });

  it('resetTokenCounter should reset', () => {
    resetTokenCounter();
    const stats = getTokenStats();
    expect(stats.totalTokensUsed).toBe(0);
  });
});

describe('Accelerate Audio Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accelerateAudioBuffer should be a function', () => {
    expect(typeof accelerateAudioBuffer).toBe('function');
  });

  // Nota: Teste real do accelerateAudioBuffer exigiria dados de áudio válidos
  // Este teste apenas verifica se a função existe
});

describe('WhatsApp Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('setupBot should setup client', () => {
    const mockClient = {
      on: jest.fn()
    };
    setupBot(mockClient as any);
    expect(mockClient.on).toHaveBeenCalledTimes(5); // ready, qr, message, auth_failure, disconnected
  });
});