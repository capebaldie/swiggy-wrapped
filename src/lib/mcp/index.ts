import type { SwiggyMCPClient } from "./client";
import { MockClient } from "./mock-client";
import { ProdClient } from "./prod-client";

let instance: SwiggyMCPClient | null = null;

export function getMcpClient(): SwiggyMCPClient {
  if (instance) return instance;
  instance = process.env.SWIGGY_MCP_MODE === "prod" ? new ProdClient() : new MockClient();
  return instance;
}

export type { SwiggyMCPClient } from "./client";
