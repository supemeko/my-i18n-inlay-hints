import { ioLog, log } from "./log.ts";

export async function serve(
  handleMessage: (input: string) => Promise<string | null>,
) {
  const reader = Deno.stdin.readable.getReader();

  let buffer = "";
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      // 结束了
      log("Stdin closed");
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    while (buffer.includes("\r\n\r\n")) {
      const [header, ...body] = buffer.split("\r\n\r\n");
      const contentLengthMatch = header.match(/Content-Length: (\d+)/);
      if (!contentLengthMatch) {
        ioLog("contentLengthMatch error:" + header)
        continue
      };

      const contentLength = parseInt(contentLengthMatch[1], 10);
      const bodyByte = encoder.encode(body.join("\r\n\r\n"));

      // .slice(0, contentLength)
      const len = encoder.encode(`${bodyByte}`).length;
      if (len < contentLength) continue;
      const message = decoder.decode(bodyByte.subarray(0, contentLength));
      ioLog(`read(${contentLength}): ${message}`);

      // 处理消息
      const response = await handleMessage(message);
      if (response) {
        const contentByte = encoder.encode(`${response}`);
        const contentLen = contentByte.length;
        ioLog(`write(${contentLen}): ${response}`);

        const headerByte = encoder.encode(
          `Content-Length: ${contentLen}\r\n\r\n`,
        );
        const responseByte = concatTwoUint8Arrays(headerByte, contentByte);
        ioLog(`responseByte(${responseByte.length})`)
        const resp = await writeAllToStdout(responseByte);
        ioLog(`respByte(${resp})`)
      }

      // 更新缓冲区
      buffer = buffer.slice(header.length + 4 + message.length);
    }
  }
}

function concatTwoUint8Arrays(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
  const result = new Uint8Array(arr1.length + arr2.length);
  result.set(arr1, 0);
  result.set(arr2, arr1.length);
  return result;
}

async function writeAllToStdout(data: Uint8Array): Promise<number> {
  let offset = 0;
  while (offset < data.length) {
    const bytesWritten = await Deno.stdout.write(data.subarray(offset));
    ioLog(`respByteBlock(${bytesWritten})`)
    offset += bytesWritten;
  }
  return offset;
}

// const serve = (
//   handleMessage: (async (input: string): Promise<string>)
// ) => {
//   const reader = Deno.stdin.readable.getReader();
//   let buffer = "";

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) {
//       logToFile("Stdin closed");
//       break;
//     }

//     buffer += decoder.decode(value, { stream: true });

//     // LSP 使用 Content-Length 头部解析消息
//     while (buffer.includes("\r\n\r\n")) {
//       const [header, ...rest] = buffer.split("\r\n\r\n");
//       const contentLengthMatch = header.match(/Content-Length: (\d+)/);
//       if (!contentLengthMatch) continue;

//       const contentLength = parseInt(contentLengthMatch[1], 10);
//       const message = rest.join("\r\n\r\n").slice(0, contentLength);
//       const len = new TextEncoder().encode(`${message}`).length;
//       logRequest(`new request: ${len}: ${contentLength}`);
//       if (len < contentLength) {
//         continue;
//       }

//       // 处理消息
//       logRequest(
//         `====================reqeust =======================\n${message}`,
//       );
//       const response = handleMessage(message);
//       logRequest(
//         `====================response========================\n${response}`,
//       );
//       if (response) {
//         let resByte = new TextEncoder().encode(`${response}`);
//         const responseBuffer = new TextEncoder().encode(
//           `Content-Length: ${resByte.length}\r\n\r\n${response}`,
//         );
//         // logRequest(`====================response===========\nContent-Length: ${resByte.length}\r\n\r\n${response}`)
//         await writeToStdout(responseBuffer);
//       }

//       // 更新缓冲区
//       buffer = buffer.slice(header.length + 4 + contentLength);
//     }
//   }
// };
