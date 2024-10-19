import git from "isomorphic-git";
import fs from "node:fs/promises";
import { Fmt } from "./helper.ts";

const gitDirectory = "./build/manifests-repo/";
const gitBranch = "main";

if (import.meta.main) {
  const startTime = performance.now();
  const dir = gitDirectory;

  await git.init({ fs, dir, defaultBranch: gitBranch });
  const branch = await git.currentBranch({ fs, dir, fullname: true });
  console.log("dir:", dir);
  console.log("branch:", branch);

  // await git.checkout({ fs, dir, ref: gitBranch });
  const encoder = new TextEncoder();
  for (let index = 0; index < 1_000; index += 1) {
    await fs.mkdir(
      dir + "applications/application-name/releases/release-number/",
      { recursive: true },
    );
    await fs.writeFile(
      dir + "applications/application-name/releases/release-number/" +
        "release-message.txt",
      `${index}`,
    );
    await git.add({ fs, dir, filepath: "." });
    await git.commit({
      fs,
      dir,
      message: `message ${index}`,
      author: {
        name: "author name",
        email: "author email",
      },
    });
    Deno.stdout.write(encoder.encode("."));
  }

  const log = await git.log({ fs, dir, ref: gitBranch });
  console.log(log.length);
  console.log("time:", Fmt.millisDiff(startTime, performance.now(), "millis"));
}
