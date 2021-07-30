import { Command } from "../../deps.ts";
import { version } from "../version.ts";
import { LinkCommand } from "./link.ts";
import { RunCommand } from "./run.ts";
import { ImportCommand } from "./import.ts";
import { MappingConfig } from "../mapping_config.ts";
import { PlatformType } from "./types/platform_type.ts";

export class DdotCommand extends Command {
  constructor(private configData: MappingConfig[] | MappingConfig | null) {
    super();
    this.name("ddot")
      .version(version)
      .description("Ddot dotfile manager")
      .type("platform", new PlatformType())
      .command("import", new ImportCommand())
      .command("link", new LinkCommand(this.configData))
      .command("run", new RunCommand(this.configData));
  }
}
