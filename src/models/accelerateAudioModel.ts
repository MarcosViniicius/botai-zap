// Essa função acelera a velocidade do áudio using ffmpeg-static e retorna um novo buffer de áudio acelerado, que logo é usado para transcrição e resposta.

import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";

// O speed pode ser ajustado conforme necessário, mas é recomendado manter entre 1.5 e 2.0 para evitar distorções significativas.
export function accelerateAudioBuffer(inputBuffer: Buffer, speed: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!ffmpegStatic) {
      reject(new Error("ffmpeg-static not found"));
      return;
    }

    const ffmpegProcess = spawn(ffmpegStatic, [
      '-i', 'pipe:0',           // Entrada via stdin
      '-af', `atempo=${speed}`, // Filtro de áudio para ajustar o tempo
      '-f', 'ogg',              // Formato de saída
      'pipe:1'                  // Saída via stdout
    ]);

    const chunks: Buffer[] = [];
    
    // Captura dados de saída (áudio processado)
    ffmpegProcess.stdout.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // Consome stderr silenciosamente (FFmpeg envia informações para stderr por padrão)
    ffmpegProcess.stderr.on('data', () => {
      // Consome silenciosamente para evitar poluição no console
    });

    // Trata a conclusão do processo
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`Processo FFmpeg terminou com código ${code}`));
      }
    });

    // Trata erros do processo
    ffmpegProcess.on('error', (error) => {
      reject(error);
    });

    // Escreve o buffer de entrada no stdin e o fecha
    ffmpegProcess.stdin.write(inputBuffer);
    ffmpegProcess.stdin.end();
  });
}