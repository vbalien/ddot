import { existsSync, path } from "../deps.ts";
import { MappingConfig } from "./mapping_config.ts";

export async function loadConfig(): Promise<
  MappingConfig | MappingConfig[] | null
> {
  const dir = Deno.cwd();
  const p = path.join(dir, "mapping.ts");

  if (existsSync(p)) {
    return (await import(p)).default;
  }
  return null;
}
