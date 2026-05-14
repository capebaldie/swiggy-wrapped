#!/usr/bin/env node
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";

const ips = Object.entries(networkInterfaces())
  .flatMap(([name, addrs]) => (addrs ?? []).map((a) => ({ name, ...a })))
  .filter((a) => a.family === "IPv4" && !a.internal)
  // de-prioritize docker/bridge interfaces — keep wlan/eth first
  .sort((a, b) => {
    const score = (n) => (/^(docker|br-|veth|vmnet|virbr)/.test(n) ? 1 : 0);
    return score(a.name) - score(b.name);
  });

const C = { dim: "\x1b[2m", reset: "\x1b[0m", bold: "\x1b[1m", orange: "\x1b[38;5;208m" };
console.log("");
console.log(`  ${C.bold}Swiggy Wrapped — LAN dev${C.reset}`);
console.log(`  ${C.dim}Local:${C.reset}    http://localhost:${port}`);
for (const ip of ips) {
  console.log(`  ${C.dim}${ip.name.padEnd(8)}:${C.reset} ${C.orange}http://${ip.address}:${port}${C.reset}`);
}
console.log("");

const child = spawn("next", ["dev", "-H", "0.0.0.0", "-p", port], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
