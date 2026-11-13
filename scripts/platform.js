import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const platform = path.join(repo, "sevana-platform");
const requestedAction = process.argv[2] || "dev";
const action = ["build", "lint"].includes(requestedAction) ? requestedAction : "dev";
const toolName = action === "lint" ? "eslint" : "vite";
const localTool = path.join(platform, "node_modules", ".bin", process.platform === "win32" ? `${toolName}.cmd` : toolName);
const fallbackRoot = path.join(repo, "sevana-donations", "Sevana-Donations-And-Aid");
const fallbackTool = path.join(fallbackRoot, "node_modules", ".bin", process.platform === "win32" ? `${toolName}.cmd` : toolName);
const usePlatformInstall = existsSync(localTool);
const executable = usePlatformInstall ? localTool : fallbackTool;
const cwd = usePlatformInstall || action === "lint" ? platform : fallbackRoot;
const devPort = action === "dev" ? await findAvailablePort(5173) : null;
const args = usePlatformInstall
  ? action === "build" ? ["build"] : action === "lint" ? ["."] : ["--host", "0.0.0.0", "--port", String(devPort)]
  : action === "build" ? ["build", "--config", "vite.unified.config.js"] : action === "lint" ? [".", "--config", path.join(fallbackRoot, "eslint.config.js")] : ["--config", "vite.unified.config.js", "--host", "0.0.0.0", "--port", String(devPort)];

if (!existsSync(executable)) {
  console.error("Unified Sevana dependencies are missing. Run: npm install --prefix sevana-platform");
  process.exit(1);
}
console.log(`Running unified Sevana ${action} with ${usePlatformInstall ? "its app dependencies" : "the preserved Donations toolchain"}${devPort ? ` on port ${devPort}` : ""}.`);
const child = spawn(executable, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("exit", (code) => { process.exitCode = code ?? 0; });

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    const available = await new Promise((resolve) => {
      const server = createServer();
      server.once("error", () => resolve(false));
      server.listen(port, "0.0.0.0", () => server.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error(`No free development port found between ${startPort} and ${startPort + 19}.`);
}
