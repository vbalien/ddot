import { path } from "../deps.ts";

export function getDdotPath() {
  const home = getHomePath();
  return path.resolve(home, "dotfiles");
}

export function getHomePath() {
  return Deno.env.get(Deno.build.os === "windows" ? "HOMEPATH" : "HOME") || "~";
}
