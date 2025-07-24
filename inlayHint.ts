// deno-lint-ignore-file
import { log } from "./log.ts";
import { loadLocaleFile } from "./locale.ts";
import { documents } from "./documents.ts";

const zh = await loadLocaleFile('/home/garygo/develop/zhai_farm/admin/src/i18n/locale/zh.json')

export const actions = {
  "textDocument/inlayHint": (params: any, id: number) => {
    log(`inlayHint: ${params.textDocument.uri}`);

    const range = params.range;
    const uri = params.textDocument.uri;
    const text = documents.get(uri) || "";

    const result = parseText(zh, range, text);
    const rangestr = JSON.stringify(range);
    const resultstr = JSON.stringify(result);
    log(
      `inlayHint Text: ${text.length}, range: ${rangestr}, result: ${resultstr}`,
    );

    return {
      jsonrpc: "2.0",
      id,
      result,
    };
  },
};

function parseText(dict: any, range: any, text: any) {
  let arr: any[] = [];

  const k = "$t";
  const key = (k || "").trim() + "(";
  const lines = text.split("\n");
  main:
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    if (range.start.line > lineNum || range.end.line < lineNum) {
      continue;
    }
    let r = range.start.line === lineNum ? range.start.character : 0;
    let e = range.end.line === lineNum ? range.end.character : -1;

    let line = lines[lineNum] || "";
    while (true) {
      const leftCol = line.indexOf(key, r);
      if (leftCol == -1) {
        continue main;
      }
      const rightCol = line.indexOf(")", leftCol);
      if (rightCol == -1) {
        continue main;
      }
      const i18Key = getI18NKey(line.substring(leftCol + key.length, rightCol));
      if (e < 0 || e > leftCol + key.length) {
        arr.push(resp(lineNum, leftCol + key.length, dict[i18Key] || i18Key));
      }
      r = rightCol;
    }
  }

  return arr;
}

const getI18NKey = (keyStr: string) => {
  if (!keyStr) {
    throw new Error("fuck u");
  }
  let res = keyStr;
  res = res.split(",")[0];
  res = res.replace(/[\t\n'"]/g, "");
  return res;
};

const resp = (line: number, character: number, label: string) => {
  return {
    position: { line, character }, // 示例位置
    label, // 中文 Inlay Hint
    kind: 2, // 1=Type, 2=Parameter
    tooltip: label + " tooltip",
    paddingLeft: true,
    paddingRight: true,
  };
};
