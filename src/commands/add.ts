import { Command, existsSync, path } from "../../deps.ts";
import { getDdotPath, getHomePath } from "../get_ddot_path.ts";

export class AddCommand extends Command {
  constructor() {
    super();

    this.description("Add dotfile to ddot")
      .arguments("<target:string> [baseDir:string]")
      .action((_, target: string, baseDir = "common") => {
        const ddotPath = getDdotPath();
        const linkPath = path.join(ddotPath, baseDir);

        if (!existsSync(target)) {
          throw new Error(`"${target}" is not exists!`);
        }

        Deno.mkdirSync(linkPath, { recursive: true });

        const linkTargetName = path.basename(target).replace(/^\./, "");
        const linkTarget = path.join(
          linkPath,
          linkTargetName,
        );

        Deno.renameSync(target, linkTarget);
        Deno.symlinkSync(linkTarget, target);
        console.info(`Move: "${target}" -> "${linkTarget}"`);
        console.info(`Link: "${target}" -> "${linkTarget}"`);
        console.info(
          `Add following to link of mapping.ts :\n${
            JSON.stringify(
              {
                [path.relative(getHomePath(), path.resolve(target))]: path.join(
                  baseDir,
                  linkTargetName,
                ),
              },
              null,
              2,
            )
          }`,
        );
      });
  }
}
