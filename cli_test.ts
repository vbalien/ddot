import {
  assert,
  assertEquals,
  assertMatch,
  assertStringIncludes,
  copySync,
  test,
  TestSuite,
} from "./dev_deps.ts";
import { existsSync, path } from "./deps.ts";
import { getHomePath } from "./src/get_ddot_path.ts";

const tsWd = "./test/ts";
const cliArgs = [
  "deno",
  "run",
  "-qA",
  "--unstable",
  "../../cli.ts",
];

async function runScript(
  name: string,
  wd: string = tsWd,
  additionalArgs: Array<string> = [],
): Promise<string> {
  const process = Deno.run({
    cmd: [...cliArgs, name, ...additionalArgs],
    cwd: wd,
    stdout: "piped",
    stderr: "piped",
  });
  const { code } = await process.status();
  const rawOutput: Uint8Array = await process.output();
  const rawErrOutput: Uint8Array = await process.stderrOutput();
  const stdout: string = new TextDecoder().decode(rawOutput);
  const stderr: string = new TextDecoder().decode(rawErrOutput);

  if (code === 0) {
    process.close();
    return stdout;
  } else {
    process.close();
    throw new Error(`Process exited with error code ${code}\n${stderr}`);
  }
}

let oldHome: string;
const testSuite = new TestSuite({
  name: "test",
  beforeEach() {
    const fakeHome = path.join(tsWd, "home");
    Deno.mkdirSync(fakeHome);
    copySync(path.join(tsWd, "dotfiles"), path.join(fakeHome, "dotfiles"));

    oldHome = getHomePath();
    Deno.env.set(
      Deno.build.os === "windows" ? "HOMEPATH" : "HOME",
      path.resolve(fakeHome),
    );
  },

  afterEach() {
    Deno.env.set(
      Deno.build.os === "windows" ? "HOMEPATH" : "HOME",
      oldHome,
    );

    const fakeHome = path.join(tsWd, "home");
    Deno.removeSync(fakeHome, { recursive: true });
  },
});

test(testSuite, "guards", async () => {
  let output: string;
  output = await runScript("run", tsWd, [
    "--platform=darwin",
    "--hostname=laptop",
  ]);
  assertStringIncludes(output, "laptop darwin");

  output = await runScript("run", tsWd, [
    "--platform=windows",
    "--hostname=home",
  ]);
  assertStringIncludes(output, "home windows");
});

test(testSuite, "scripts", async () => {
  const output = await runScript("run", tsWd, [
    "--platform=windows",
    "--hostname=home",
  ]);
  assertStringIncludes(output.trim(), "works!");
});

test(testSuite, "extends", async () => {
  const output = await runScript("run", tsWd, [
    "--name=desktop",
    "--platform=darwin",
  ]);
  assertMatch(
    output.trim(),
    /^Run: .*\ndesktop darwin\nRun: .*\nworks!\nRun: .*\ndesktop$/,
  );
});

test(testSuite, "add/remove", async () => {
  Deno.openSync(path.join(tsWd, "home/.import_test"), {
    write: true,
    create: true,
  }).close();

  const target = "./home/.import_test";
  const baseDir = "mydot";

  await runScript("add", tsWd, [
    target,
    baseDir,
  ]);

  const targetPath = path.join(tsWd, target);
  assert(Deno.lstatSync(targetPath).isSymlink);

  const targetRealPath = Deno.realPathSync(targetPath);
  const targetDotPath = path.resolve(tsWd, "home/dotfiles/mydot/import_test");
  assert(existsSync(targetDotPath));
  assertEquals(targetRealPath, targetDotPath);

  await runScript("remove", tsWd, [
    target,
  ]);

  assert(!existsSync(targetDotPath));
  assert(!Deno.lstatSync(targetPath).isSymlink);
});

test(testSuite, "link/unlink", async () => {
  await runScript("link", tsWd, [
    "--name=laptop",
  ]);

  const home = path.join(tsWd, "home");
  const dotfiles = path.join(home, "dotfiles");

  const testHomePath = path.join(home, "test");
  const test1HomePath = path.join(home, "test2");
  const testDotPath = path.join(dotfiles, "test");
  const test1DotPath = path.join(dotfiles, "test1");

  assert(Deno.lstatSync(testHomePath).isSymlink);
  assert(Deno.lstatSync(test1HomePath).isSymlink);
  const testRealPath = Deno.realPathSync(testHomePath);
  const test1RealPath = Deno.realPathSync(test1HomePath);

  assertEquals(testRealPath, path.resolve(testDotPath));
  assertEquals(test1RealPath, path.resolve(test1DotPath));

  await runScript("unlink", tsWd, [
    "--name=laptop",
  ]);

  assert(!existsSync(testHomePath));
  assert(!existsSync(test1HomePath));
});
