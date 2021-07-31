import { DdotCommand } from "./src/commands/mod.ts";

if (import.meta.main) {
  try {
    new DdotCommand().parse(Deno.args);
  } catch (err) {
    console.error(err.message);
  }
}
