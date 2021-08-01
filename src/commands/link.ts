import { existsSync, path } from "../../deps.ts";
import { MappingConfig } from "../mapping_config.ts";
import { getDdotPath, getHomePath } from "../get_ddot_path.ts";
import { BaseCommand } from "./base_command.ts";

export class LinkCommand extends BaseCommand {
  constructor() {
    super();

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

        const targetDir = path.dirname(targetPath);
        if (!existsSync(targetDir)) {
          Deno.mkdirSync(targetDir, { recursive: true });
        }

        if (existsSync(targetPath)) {
          if (
            Deno.lstatSync(targetPath).isSymlink &&
            Deno.realPathSync(targetPath) === path.resolve(fromPath)
          ) {
            console.info(`Info: '${targetPath}' already linked!`);
            continue;
          }

          console.info(
            `Info: "${targetPath}" already exist. move to "${targetPath +
              ".ddot.bak"}"`,
          );
          Deno.renameSync(targetPath, targetPath + ".ddot.bak");
        }

        console.info(`Link: "${targetPath}" -> "${fromPath}"`);
        Deno.symlinkSync(fromPath, targetPath);
      }
    }
  }
}
