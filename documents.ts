// deno-lint-ignore-file no-explicit-any
import { log } from "./log.ts";

export const documents: Map<string, string> = new Map();

export const actions = {
  "textDocument/didOpen": (params: any) => {
    log(
      `Document opened: ${params.textDocument.uri}:${params.textDocument.text?.length}`,
    );
    if (params.textDocument.text) {
      documents.set(params.textDocument.uri, params.textDocument.text);
    }
    return null;
  },
  "textDocument/didChange": (params: any) => {
    log(
      `Document changed: ${params.textDocument.uri}:${
        params.contentChanges?.[0]?.text?.length
      }`,
    );
    if (params.contentChanges?.[0]?.text) {
      documents.set(params.textDocument.uri, params.contentChanges?.[0]?.text);
    }
    return null;
  },
  "textDocument/didSave": (params: any) => {
    log(`Document saved: ${params.textDocument.uri}:${params.text?.length}`);
    if (params.text) {
      documents.set(params.textDocument.uri, params.text);
    }
    return null;
  },
};
