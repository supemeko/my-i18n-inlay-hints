// deno-lint-ignore-file no-explicit-any
import * as path from "https://deno.land/std/path/mod.ts";
import { log, setLogFile } from "./log.ts";
import { serve } from "./serve.ts";
import { actions as inlayHint } from "./inlayHint.ts";
import { actions as documents } from "./documents.ts";
const initialize = {
  initialize: (params: any, id: any) => {
    log(`Initialize request: ${JSON.stringify(params)}`);
    return {
      jsonrpc: "2.0",
      id,
      result: {
        capabilities: {
          "inlayHintProvider": true,
          "textDocumentSync": 1, // 增量同步
        },
      },
    };
  },
};

const actions: any = { ...inlayHint, ...documents, ...initialize };

// 获取可执行文件路径
const execPath = Deno.execPath();
const extPath = path.dirname(execPath);
// 获取可执行文件所在目录
// const execDir = .dirname();
setLogFile(`${extPath}/io-log.log`, `${extPath}/log.log`);
log("Executable directory mm:" + path.dirname(execPath));

serve(async (message: string) => {
  try {
    const { id, method, params } = JSON.parse(message);
    const action = actions[method];

    if (!action) {
      const error = `Method ${method} not found`;
      log(error);
      return JSON.stringify({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: error },
      });
    }

    const result = await action(params, id);
    if (!result) return null;

    return JSON.stringify(result);
  } catch (e: any) {
    const error = `Parse error: ${e.message}\n${message}\nend`;
    log(error);
    return JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32700, message: error },
    });
  }
});
