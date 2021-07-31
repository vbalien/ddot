import { existsSync, path } from "../../deps.ts";
import { MappingConfig } from "../mapping_config.ts";
import { getDdotPath, getHomePath } from "../get_ddot_path.ts";
import { BaseCommand } from "./base_command.ts";

export class UnlinkCommand extends BaseCommand {
  constructor() {
    super();

    this.description("Unlink dotfiles");
  }

  ready(configData: MappingConfig) {
    if (configData.link) {
      for (const [target, from] of Object.entries(configData.link)) {
        const targetPath = path.join(getHomePath(), target);
        const fromPath = path.join(getDdotPath(), from);

        if (!existsSync(targetPath)) {
          console.info(`"${targetPath}" does not exist.`);
          console.info("Skip");
          continue;
        }

        if (!Deno.lstatSync(targetPath).isSymlink) {
          console.info(`"${targetPath}" does not symlink.`);
          console.info("Skip");
          continue;
        }

        if (path.resolve(fromPath) === path.resolve(targetPath)) {
          console.info(`"${fromPath}" does not added.`);
          console.info("Skip");
          continue;
        }

        console.info(`Remove: ${targetPath}`);
        Deno.removeSync(targetPath);

        if (existsSync(targetPath + ".ddot.bak")) {
          console.info(
            `Move: "${targetPath + ".ddot.bak"}" -> "${targetPath}"`,
          );
          Deno.renameSync(targetPath + ".ddot.bak", targetPath);
        }
      }
    }
  }
}
