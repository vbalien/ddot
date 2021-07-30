import { DdotCommand } from "./src/commands/ddot.ts";

if (import.meta.main) {
  try {
    new DdotCommand().parse(Deno.args);
  } catch (err) {
    console.error(err.message);
  }
}
