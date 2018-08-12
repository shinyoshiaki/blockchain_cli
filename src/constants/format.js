import type from "./type";

export function sendFormat(session, body) {
  return JSON.stringify({
    layer: "transport",
    transport: "blockchainCli",
    type: type.BLOCKCHAIN,
    session: session,
    body: body //transaction format / board format
  });
}
