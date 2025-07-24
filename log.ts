let ioFile: string | null = null;
let file: string | null = null;

export function setLogFile(_ioFile: string, _file: string) {
  ioFile = _ioFile;
  file = _file;
}

export async function ioLog(message: string) {
  if (!ioFile) return;
  if (message.length > 200) {
    message = message.substring(0, 200) + '...to long'
  }
  await Deno.writeTextFile(ioFile, `[${new Date().toISOString()}]${message}\n`, { append: true });
}

export async function log(message: string) {
  if (!file) return;
  if (message.length > 200) {
    message = message.substring(0, 200) + '...to long'
  }
  await Deno.writeTextFile(file, `[${new Date().toISOString()}]${message}\n`, { append: true });
}
