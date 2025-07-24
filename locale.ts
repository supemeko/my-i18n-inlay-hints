export async function loadLocaleFile(path: string) {
  const zh = await Deno.readFile(path);
  return JSON.parse(new TextDecoder().decode(zh));
}
