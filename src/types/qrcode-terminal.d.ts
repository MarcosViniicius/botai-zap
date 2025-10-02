declare module 'qrcode-terminal' {
  interface Options {
    small?: boolean;
  }
  export function generate(data: string, options?: Options): void;
}
