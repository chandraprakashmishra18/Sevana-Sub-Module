require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/config/prisma");

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () => {
  console.log(`Sevana API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down API`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
