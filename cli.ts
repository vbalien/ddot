import { loadConfig } from "./src/load_config.ts";
import { DdotCommand } from "./src/commands/ddot.ts";

if (import.meta.main) {
  const config = await loadConfig();
  new DdotCommand(config).parse(Deno.args);
}
