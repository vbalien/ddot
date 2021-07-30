export type Platform = "darwin" | "windows" | "linux";

export interface MappingConfig {
  name: string;
  guards?: {
    hostname?: string | string[];
    platform?: Platform | Platform[];
  };
  link?: Record<string, string>;
  scripts?: string[];
  extends?: string;
}
