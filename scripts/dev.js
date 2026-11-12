import { spawn } from "child_process";

const args = process.argv.slice(2).map((a) => a.toLowerCase());
const isCamps = args.some((a) => a.includes("camp"));
const isDonations = args.some((a) => a.includes("donat"));

console.log("\n=======================================================");
console.log("  🌟 SEVANA COMMUNITY SERVICE & DONATIONS PLATFORM");
console.log("=======================================================\n");

function startProcess(name, dir, defaultPort) {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "npm.cmd" : "npm";
  const child = spawn(cmd, ["run", "dev"], {
    cwd: dir,
    stdio: "inherit",
    shell: true,
  });

  child.on("error", (err) => {
    console.error(`[${name}] Failed to start:`, err.message);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`[${name}] Exited with code ${code}`);
    }
  });

  return child;
}

const processes = [];

if (isCamps && !isDonations) {
  console.log("🏕️  Starting Camps & Community Service Module...");
  console.log("👉 URL: http://localhost:5174/\n");
  processes.push(startProcess("CAMPS", "./sevana-camps/Sevana-Camps-Module", 5174));
} else if (isDonations && !isCamps) {
  console.log("💖 Starting Donations & Aid Module...");
  console.log("👉 URL: http://localhost:5173/\n");
  processes.push(startProcess("DONATIONS", "./sevana-donations/Sevana-Donations-And-Aid", 5173));
} else {
  console.log("🚀 Starting BOTH Modules in Parallel:");
  console.log("   🏕️  Camps & Community Service : http://localhost:5174/");
  console.log("   💖  Donations & Aid           : http://localhost:5173/\n");
  processes.push(startProcess("CAMPS", "./sevana-camps/Sevana-Camps-Module", 5174));
  processes.push(startProcess("DONATIONS", "./sevana-donations/Sevana-Donations-And-Aid", 5173));
}

function shutdown() {
  console.log("\n🛑 Stopping servers...");
  processes.forEach((p) => {
    try {
      p.kill();
    } catch (e) {}
  });
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

