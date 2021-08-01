import { Command, mergeWith } from "../../deps.ts";
import { loadConfig } from "../load_config.ts";
import { MappingConfig, Platform } from "../mapping_config.ts";

export abstract class BaseCommand extends Command {
  private mappings: MappingConfig[] = [];
  protected platform: string | null = null;
  protected hostname: string | null = null;

  abstract ready(configData: MappingConfig): Promise<void> | void;

  constructor() {
    super();

    this.option("-n, --name <name>", "target name (.name field)")
      .option(
        "-p, --platform <platform>",
        "target platform",
      )
      .option("-h, --hostname <hostname>", "target hostname")
      .action(async (options) => {
        const configData = await loadConfig();

        if (!configData) {
          throw new Error("mapping.ts is not found!");
        }

        this.setMappings(configData);

        const name = options.name;
        const platform: Platform = this.platform = options.platform ??
          Deno.build.os;
        const hostname = this.hostname = options.hostname ?? Deno.hostname();
        let found: MappingConfig | null = null;

        if (name) {
          found = this.findMappingByName(name) ?? null;
        }

        if (!found) {
          found = this.findMapping(hostname, platform);
        }

        if (!found) {
          throw new Error(
            `No matching configuration found.\nplatform: ${platform}\nhostname: ${hostname}\nname: ${name}`,
          );
        }

        await this.ready(found);
      });
  }

  setMappings(configData: MappingConfig | MappingConfig[]) {
    const mappings = [];
    if (configData instanceof Array) {
      mappings.push(...configData);
    } else {
      this.mappings.push(configData);
    }

    for (let mapping of mappings) {
      if (mapping.extend) {
        mapping = this.combineExtend(mappings, mapping);
      }
      this.mappings.push(mapping);
    }
  }

  findMapping(hostname: string, platform: Platform) {
    let found: MappingConfig | null = null;
    for (const config of this.mappings) {
      if (!config.guard) continue;
      const configHostname = config.guard.hostname;
      const configPlatform = config.guard.platform;

      if (
        (
          ((configHostname instanceof Array) &&
            configHostname.includes(hostname)) ||
          (typeof configHostname === "string" &&
            configHostname === hostname)
        ) &&
        (
          ((configPlatform instanceof Array) &&
            configPlatform.includes(platform)) ||
          (typeof configPlatform === "string" &&
            configPlatform === platform)
        )
      ) {
        found = config;
        break;
      }
    }
    return found;
  }

  findMappingByName(name: string): MappingConfig | undefined {
    return this.mappings.find((config) => config.name === name);
  }

  combineExtend(
    mappings: MappingConfig[],
    config: MappingConfig,
  ): MappingConfig {
    let { extend: parentName, ...curr }: MappingConfig = config;
    const configs: MappingConfig[] = [curr];
    const result: MappingConfig = { name: "" };

    while (parentName) {
      const found = mappings.find((config) => config.name === parentName);

      if (!found) {
        console.error(mappings);
        console.error(parentName);
        throw new Error("Extend not found");
      }

      const { extend: nextParentName, ...nextCurr } = found;
      parentName = nextParentName;
      curr = nextCurr;
      configs.push(curr);
    }

    for (const config of configs) {
      mergeWith(result, config, (obj: unknown, src: unknown) => {
        if (obj instanceof Array && src instanceof Array) {
          return src.concat(obj);
        }
      });
    }

    result.name = config.name;
    return result;
  }
}
