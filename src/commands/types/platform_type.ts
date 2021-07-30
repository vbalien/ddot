import { StringType } from "../../../deps.ts";
import { Platform } from "../../mapping_config.ts";

export class PlatformType extends StringType {
  complete(): Platform[] {
    return ["linux", "darwin", "windows"];
  }
}
