import { existsSync, path } from "../../deps.ts";
import { MappingConfig } from "../mapping_config.ts";
import { getDdotPath, getHomePath } from "../get_ddot_path.ts";
import { BaseCommand } from "./base_command.ts";

export class LinkCommand extends BaseCommand {
  constructor(configData: MappingConfig | MappingConfig[] | null) {
    super(configData);

    this.description("Link dotfiles");
  }

  ready(configData: MappingConfig) {
    if (configData.link) {
      for (const [target, from] of Object.entries(configData.link)) {
        const targetPath = path.join(getHomePath(), target);
        const fromPath = path.join(getDdotPath(), from);

        if (!existsSync(fromPath)) {
          throw new Error(`"${fromPath}" does not exist.`);
        }

        if (existsSync(targetPath)) {
          console.log(
            `"${targetPath}" does exist. move to "${targetPath +
              ".ddot.bak"}"`,
          );
          Deno.renameSync(targetPath, targetPath + ".ddot.bak");
        }

        console.log(`Link: "${targetPath}"`);
        Deno.symlinkSync(fromPath, targetPath);
      }
    }
  }
}
