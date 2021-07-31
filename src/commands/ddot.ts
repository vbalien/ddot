import { Command } from "../../deps.ts";
import { version } from "../version.ts";
import {
  AddCommand,
  LinkCommand,
  RemoveCommand,
  RunCommand,
  UnlinkCommand,
} from "./mod.ts";
import { PlatformType } from "./types/platform_type.ts";

export class DdotCommand extends Command {
  constructor() {
    super();
    this.name("ddot")
      .version(version)
      .description("Ddot dotfile manager")
      .type("platform", new PlatformType())
      .command("add", new AddCommand())
      .command("remove", new RemoveCommand())
      .command("link", new LinkCommand())
      .command("unlink", new UnlinkCommand())
      .command("run", new RunCommand())
      .reset();
  }
}
