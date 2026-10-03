import app from "./src/app.ts";
import { prisma } from "./src/lib/prisma.ts";

const PORT = 3000;

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
