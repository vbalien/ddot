import { Command, existsSync, path } from "../../deps.ts";
import { getDdotPath } from "../get_ddot_path.ts";

export class RemoveCommand extends Command {
  constructor() {
    super();

    this.description("Remove dotfile from ddot")
      .arguments("<target:string>")
      .action((_, target: string) => {
        if (!existsSync(target)) {
          throw new Error(`"${target}" is not exists!`);
        }

        const ddotPath = getDdotPath();
        const targetDotPath = path.resolve(Deno.realPathSync(target));
        const targetDotRelPath = path.relative(ddotPath, targetDotPath);

        if (
          targetDotRelPath.match(/^\.\.\//) &&
          !Deno.lstatSync(target).isSymlink
        ) {
          throw new Error(`"${target}" is not added!`);
        }

        console.log(`Remove: ${target}`);
        Deno.removeSync(target);
        console.log(`Move: ${targetDotPath} -> ${target}`);
        Deno.renameSync(targetDotPath, target);
      });
  }
}
