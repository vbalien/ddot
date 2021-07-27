export type Platform = "darwin" | "win32" | "linux";

export interface MappingConfig {
  name: string;
  guards?: {
    hostname?: string | string[];
    platform?: Platform | Platform[];
  };
  link?: Record<string, string>;
  preScripts?: string[];
  postScripts?: string[];
  extends?: string;
}
