import { path } from "../deps.ts";

export function getDdotPath() {
  const home = getHomePath();
  return path.join(home, "dotfiles");
}

export function getHomePath() {
  return Deno.env.get(Deno.build.os === "windows" ? "HOMEPATH" : "HOME") || "~";
}
