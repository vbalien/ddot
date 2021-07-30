import { Command, mergeWith } from "../../deps.ts";
import { MappingConfig, Platform } from "../mapping_config.ts";

export abstract class BaseCommand extends Command {
  private mappings: MappingConfig[] = [];
  protected platform: string | null = null;
  protected hostname: string | null = null;

  abstract ready(configData: MappingConfig): Promise<void> | void;

  constructor(configData: MappingConfig | MappingConfig[] | null) {
    super();

    if (!configData) {
      throw new Error("mapping.ts is not found!");
    }

    if (configData instanceof Array) {
      this.mappings.push(...configData);
    } else {
      this.mappings.push(configData);
    }

    this.option("-n, --name <name>", "target name (.name field)")
      .option(
        "-p, --platform <platform>",
        "target platform",
      )
      .option("-h, --hostname <hostname>", "target hostname")
      .action(async (options) => {
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

        if (found.extends) {
          found = this.combineExtends(found);
        }

        await this.ready(found);
      });
  }

  findMapping(hostname: string, platform: Platform) {
    let found: MappingConfig | null = null;
    for (const config of this.mappings) {
      if (!config.guards) continue;
      const configHostname = config.guards.hostname;
      const configPlatform = config.guards.platform;

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
    for (const config of this.mappings) {
      if (config.name === name) {
        return config;
      }
    }
  }

  combineExtends(config: MappingConfig): MappingConfig {
    let { extends: parentName, ...curr }: MappingConfig = config;
    const configs: MappingConfig[] = [curr];
    const result: MappingConfig = { name: "" };

    while (parentName) {
      const found = this.findMappingByName(
        parentName,
      );

      if (!found) {
        throw new Error("Extends not found");
      }

      const { extends: nextParentName, ...nextCurr } = found;
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
