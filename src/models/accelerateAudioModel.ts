// Essa função acelera a velocidade do áudio usando ffmpeg e retorna um novo buffer de áudio acelerado, que logo é usado para transcrição e resposta.

import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import stream from "stream";

ffmpeg.setFfmpegPath(ffmpegStatic!);

// O speed pode ser ajustado conforme necessário, mas é recomendado manter entre 1.5 e 2.0 para evitar distorções significativas.
export function accelerateAudioBuffer(inputBuffer: Buffer, speed: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = new stream.PassThrough();
    const outputStream = new stream.PassThrough();
    const chunks: Buffer[] = [];

    inputStream.end(inputBuffer);

    ffmpeg(inputStream)
      .audioFilters(`atempo=${speed}`)
      .format("ogg")
      .on("error", reject)
      .on("end", () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe(outputStream);

    outputStream.on("data", (chunk) => chunks.push(chunk));
  });
}

