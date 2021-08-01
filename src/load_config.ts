import { existsSync, path } from "../deps.ts";
import { MappingConfig } from "./mapping_config.ts";
import { getDdotPath } from "./get_ddot_path.ts";

export async function loadConfig(): Promise<
  MappingConfig | MappingConfig[] | null
> {
  const p = path.join(getDdotPath(), "mapping.ts");
  const altp = path.join(Deno.cwd(), "mapping.ts");

  if (existsSync(p)) {
    return (await import("file://" + p)).default;
  } else if (existsSync(altp)) {
    return (await import("file://" + altp)).default;
  }

  return null;
}
