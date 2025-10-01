import { Message } from 'whatsapp-web.js';
import { generateTextGpt } from './openaiService';
import { getHistoryStats, clearHistory, getTokenStats, resetTokenCounter } from '../models/historyModel';
import fs from 'fs';
import path from 'path';

interface CommandHandler {
  command: string;
  description: string;
  handler: (msg: Message, args: string[]) => Promise<void>;
}

// Lista de comandos disponíveis
const commands: CommandHandler[] = [
  {
    command: '/help',
    description: 'Mostra todos os comandos disponíveis',
    handler: handleHelp
  },
  {
    command: '/stats',
    description: 'Mostra estatísticas de uso do bot',
    handler: handleStats
  },
  {
    command: '/clear',
    description: 'Limpa seu histórico de conversação',
    handler: handleClear
  },
  {
    command: '/tokens',
    description: 'Mostra estatísticas de tokens consumidos',
    handler: handleTokens
  },
  {
    command: '/reset_tokens',
    description: 'Reseta contador de tokens',
    handler: handleResetTokens
  },
  {
    command: '/ping',
    description: 'Testa se o bot está respondendo',
    handler: handlePing
  },
  {
    command: '/weather',
    description: 'Pergunta sobre o clima de uma cidade (ex: /weather São Paulo)',
    handler: handleWeather
  },
  {
    command: '/translate',
    description: 'Traduz texto (ex: /translate pt-en Olá mundo)',
    handler: handleTranslate
  },
  {
    command: '/summarize',
    description: 'Resume um texto longo',
    handler: handleSummarize
  },
  {
    command: '/joke',
    description: 'Conta uma piada',
    handler: handleJoke
  },
  {
    command: '/quote',
    description: 'Gera uma frase motivacional',
    handler: handleQuote
  },
  {
    command: '/math',
    description: 'Resolve cálculos matemáticos (ex: /math 2+2*3)',
    handler: handleMath
  },
  {
    command: '/define',
    description: 'Define uma palavra ou conceito (ex: /define inteligência artificial)',
    handler: handleDefine
  },
  {
    command: '/news',
    description: 'Pergunta sobre notícias recentes de um tópico',
    handler: handleNews
  },
  {
    command: '/recipe',
    description: 'Sugere receitas baseadas em ingredientes (ex: /recipe frango, arroz)',
    handler: handleRecipe
  },
  {
    command: '/workout',
    description: 'Sugere exercícios ou treinos',
    handler: handleWorkout
  },
  {
    command: '/reminder',
    description: 'Cria um lembrete (apenas exibe, não agenda)',
    handler: handleReminder
  },
  {
    command: '/facts',
    description: 'Compartilha fatos interessantes sobre um tópico',
    handler: handleFacts
  },
  {
    command: '/code',
    description: 'Ajuda com programação (ex: /code python função para ordenar lista)',
    handler: handleCode
  },
  {
    command: '/study',
    description: 'Ajuda com estudos e explicações acadêmicas',
    handler: handleStudy
  }
];

// Handler principal para comandos
export async function handleCommand(msg: Message): Promise<boolean> {
  const text = (msg.body || '').trim();
  
  if (!text.startsWith('/')) {
    return false;
  }

  const parts = text.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const commandHandler = commands.find(cmd => cmd.command === command);
  
  if (commandHandler) {
    try {
      await commandHandler.handler(msg, args);
      return true;
    } catch (error) {
      console.error(`Erro ao executar comando ${command}:`, error);
      await msg.reply('❌ Erro ao executar comando. Tente novamente.');
      return true;
    }
  }

  return false;
}

// Implementações dos handlers

async function handleHelp(msg: Message, args: string[]): Promise<void> {
  const helpText = `🤖 **Comandos Disponíveis**\n\n${commands.map(cmd => 
    `${cmd.command} - ${cmd.description}`
  ).join('\n')}\n\n💡 *Dica: Você também pode conversar normalmente comigo ou enviar áudios!*`;
  
  await msg.reply(helpText);
}

async function handleStats(msg: Message, args: string[]): Promise<void> {
  const stats = getHistoryStats();
  const statsMessage = `📊 **Estatísticas do Bot**\n\n👥 Total de usuários: ${stats.totalUsers}\n📝 Mensagens por usuário:\n${Object.entries(stats.userStats).map(([id, count]) => `• ${id.slice(-10)}: ${count} mensagens`).join('\n')}`;
  await msg.reply(statsMessage);
}

async function handleClear(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  clearHistory(userId);
  await msg.reply('🗑️ Seu histórico de conversação foi limpo!');
}

async function handleTokens(msg: Message, args: string[]): Promise<void> {
  const tokenStats = getTokenStats();
  const statsText = `🔢 **Estatísticas de Tokens**\n\n📊 Tokens Totais: ${tokenStats.totalTokensUsed}\n� Debug habilitado: ${tokenStats.debugEnabled ? 'Sim' : 'Não'}\n\n� *Para ver detalhes no console, ative DEBUG_TOKENS=true no .env*`;
  
  await msg.reply(statsText);
}

async function handleResetTokens(msg: Message, args: string[]): Promise<void> {
  resetTokenCounter();
  await msg.reply('🔄 Contador de tokens resetado!');
}

async function handlePing(msg: Message, args: string[]): Promise<void> {
  const startTime = Date.now();
  await msg.reply(`🏓 Pong! Latência: ${Date.now() - startTime}ms`);
}

async function handleWeather(msg: Message, args: string[]): Promise<void> {
  const city = args.join(' ');
  const userId = msg.author || msg.from;
  
  if (!city) {
    await msg.reply('🌤️ Por favor, especifique uma cidade. Exemplo: `/weather São Paulo`');
    return;
  }
  
  const prompt = `Forneça informações sobre o clima atual e previsão para ${city}. Se não souber dados em tempo real, explique que não tem acesso a dados atualizados e sugira fontes confiáveis.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`🌤️ **Clima em ${city}**\n\n${response}`);
}

async function handleTranslate(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length < 2) {
    await msg.reply('🔤 Uso: `/translate [idioma-destino] [texto]`\nExemplo: `/translate en Olá mundo`');
    return;
  }
  
  const targetLang = args[0];
  const textToTranslate = args.slice(1).join(' ');
  
  const prompt = `Traduza o seguinte texto para ${targetLang}: "${textToTranslate}"`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`🔤 **Tradução**\n\n${response}`);
}

async function handleSummarize(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('📝 Por favor, forneça o texto para resumir após o comando.');
    return;
  }
  
  const textToSummarize = args.join(' ');
  const prompt = `Resume o seguinte texto de forma clara e concisa: "${textToSummarize}"`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`📝 **Resumo**\n\n${response}`);
}

async function handleJoke(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  const category = args.join(' ') || 'geral';
  
  const prompt = `Conte uma piada ${category !== 'geral' ? `sobre ${category}` : 'engraçada'}. Mantenha apropriada e divertida.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`😄 ${response}`);
}

async function handleQuote(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  const topic = args.join(' ') || 'motivação';
  
  const prompt = `Gere uma frase inspiradora e motivacional sobre ${topic}.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`💭 ${response}`);
}

async function handleMath(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('🔢 Por favor, forneça o cálculo. Exemplo: `/math 2+2*3`');
    return;
  }
  
  const expression = args.join(' ');
  const prompt = `Resolva este cálculo matemático passo a passo: ${expression}`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`🔢 **Cálculo**\n\n${response}`);
}

async function handleDefine(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('📖 Por favor, forneça a palavra ou conceito para definir.');
    return;
  }
  
  const term = args.join(' ');
  const prompt = `Defina de forma clara e didática: ${term}`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`📖 **Definição de "${term}"**\n\n${response}`);
}

async function handleNews(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  const topic = args.join(' ') || 'geral';
  
  const prompt = `Fale sobre notícias e tendências recentes relacionadas a ${topic}. Se não tiver dados atualizados, explique e sugira fontes confiáveis.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`📰 **Notícias sobre ${topic}**\n\n${response}`);
}

async function handleRecipe(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('🍳 Por favor, liste os ingredientes. Exemplo: `/recipe frango, arroz, brócolis`');
    return;
  }
  
  const ingredients = args.join(' ');
  const prompt = `Sugira uma receita simples e saborosa usando estes ingredientes: ${ingredients}`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`🍳 **Receita**\n\n${response}`);
}

async function handleWorkout(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  const focus = args.join(' ') || 'geral';
  
  const prompt = `Sugira um treino ${focus !== 'geral' ? `focado em ${focus}` : 'completo'} que possa ser feito em casa ou academia.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`💪 **Treino**\n\n${response}`);
}

async function handleReminder(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('⏰ Por favor, descreva o lembrete. Exemplo: `/reminder Reunião às 15h`');
    return;
  }
  
  const reminder = args.join(' ');
  const timestamp = new Date().toLocaleString('pt-BR');
  
  await msg.reply(`⏰ **Lembrete Criado**\n\n📝 ${reminder}\n🕐 Criado em: ${timestamp}\n\n*Nota: Este é apenas um lembrete visual. Para notificações automáticas, use aplicativos dedicados.*`);
}

async function handleFacts(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  const topic = args.join(' ') || 'curiosidades gerais';
  
  const prompt = `Compartilhe 3 fatos interessantes e verdadeiros sobre ${topic}.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`🧠 **Fatos sobre ${topic}**\n\n${response}`);
}

async function handleCode(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('💻 Por favor, descreva o que precisa. Exemplo: `/code python função para ordenar lista`');
    return;
  }
  
  const request = args.join(' ');
  const prompt = `Ajude com programação: ${request}. Forneça código limpo e explicação clara.`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`💻 **Código**\n\n${response}`);
}

async function handleStudy(msg: Message, args: string[]): Promise<void> {
  const userId = msg.author || msg.from;
  
  if (args.length === 0) {
    await msg.reply('📚 Por favor, descreva o tópico de estudo. Exemplo: `/study fotossíntese`');
    return;
  }
  
  const topic = args.join(' ');
  const prompt = `Explique de forma didática e estruturada para estudos: ${topic}`;
  const response = await generateTextGpt(prompt, userId);
  await msg.reply(`📚 **Estudos: ${topic}**\n\n${response}`);
}

// Função utilitária para listar comandos
export function getAvailableCommands(): CommandHandler[] {
  return commands;
}