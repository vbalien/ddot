import { exec } from "../../deps.ts";
import { MappingConfig } from "../mapping_config.ts";
import { BaseCommand } from "./base_command.ts";

export class RunCommand extends BaseCommand {
  constructor() {
    super();

    this.description("Run scripts");
  }

  async ready(configData: MappingConfig) {
    if (configData.scripts) {
      for (const script of configData.scripts) {
        Deno.env.set("DDOT_NAME", configData.name ?? "");
        Deno.env.set("DDOT_PLATFORM", this.platform ?? "");
        Deno.env.set("DDOT_HOSTNAME", this.hostname ?? "");

        console.info("Run: " + script);
        await exec(script);

        Deno.env.delete("DDOT_NAME");
        Deno.env.delete("DDOT_PLATFORM");
        Deno.env.delete("DDOT_HOSTNAME");
      }
    }
  }
}
