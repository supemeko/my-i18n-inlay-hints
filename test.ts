const a = `Content-Length: 467

{"jsonrpc":"2.0","id":40,"result":[{"position":{"line":128,"character":41},"label":"奶牛编号","kind":2,"tooltip":"奶牛编号 tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":138,"character":41},"label":"耳标编号","kind":2,"tooltip":"耳标编号 tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":151,"character":41},"label":"RFID编号","kind":2,"tooltip":"RFID编号 tooltip","paddingLeft":true,"paddingRight":true}]}Content-Length: 86

{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method $/cancelRequest not found"}}Content-Length: 86

{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method $/cancelRequest not found"}}Content-Length: 600

{"jsonrpc":"2.0","id":41,"result":[{"position":{"line":108,"character":34},"label":"Edit Group","kind":2,"tooltip":"Edit Group tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":108,"character":53},"label":"新增动物","kind":2,"tooltip":"新增动物 tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":118,"character":40},"label":"标识","kind":2,"tooltip":"标识 tooltip","paddingLeft":true,"paddingRight"`;

const x = new TextEncoder().encode(a);
console.log(`len:${x.length}`);
// Content-Length: 1319
//
// Content-Length
// Content-Length: 321

// {"jsonrpc":"2.0","id":8,"result":[{"position":{"line":108,"character":34},"label":"Edit Group","kind":2,"tooltip":"Edit Group tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":108,"character":53},"label":"新增动物","kind":2,"tooltip":"新增动物 tooltip","paddingLeft":true,"paddingRight":true}]}Content-Length: 458

// {"jsonrpc":"2.0","id":9,"result":[{"position":{"line":118,"character":40},"label":"标识","kind":2,"tooltip":"标识 tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":128,"character":41},"label":"奶牛编号","kind":2,"tooltip":"奶牛编号 tooltip","paddingLeft":true,"paddingRight":true},{"position":{"line":138,"character":41},"label":"耳标编号","kind":2,"tooltip":"耳标编号 tooltip","paddingLeft":true,"paddingRight":true}]}Content-Length: 86

// {"jsonrpc":"2.0","error":{"code":-32601,"message":"Method $/cancelRequest not found"}}Content-Length: 86

// {"jsonrpc":"2.0","error":{"code":-32601,"message":"Method $/cancelRequest not found"}}Content-Length: 86

// {"jsonrpc":"2.0","error":{"code":-32601,"message":"Method $/cancelRequest not found"}}Content-Length: 1594

// Content-Length: 177

// {"jsonrpc":"2.0","id":11,"result":[{"position":{"line":151,"character":41},"label":"RFID编号","kind":2,"tooltip":"RFID编

// Content-Length
// 1319 - 1305 = 14
