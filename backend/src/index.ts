import { getConfig } from "./http/config";
import { startServer } from "./http/server";

async function main() {
  const config = getConfig();

  await startServer(config);
}

main().catch(console.error);
