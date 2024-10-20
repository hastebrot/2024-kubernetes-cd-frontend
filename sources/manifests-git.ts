import git from "isomorphic-git";
import fs from "node:fs/promises";
import { Fmt, Rand } from "./helper.ts";

const gitDirectory = "./build/manifests-repo/";
const gitBranch = "main";

const chunkGitCommits = 1_000 / 2;
const chunkGitLogs = 100;

if (import.meta.main) {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const dir = gitDirectory;
  const cache = {};

  {
    await git.init({ fs, dir, defaultBranch: gitBranch });
    const branch = await git.currentBranch({ fs, dir, fullname: true });
    console.log("dir:", dir);
    console.log("branch:", branch);
  }

  {
    for (let index = 0; index < chunkGitCommits; index += 1) {
      const releaseNumber = Rand.number(1, 10);
      await fs.mkdir(
        dir + `applications/application-name/releases/${releaseNumber}/`,
        { recursive: true },
      );
      await fs.writeFile(
        dir + `applications/application-name/releases/${releaseNumber}/` +
          "release-message.json",
        `${index + 1}`,
      );
      await git.add({ fs, dir, filepath: "." });
      await git.commit({
        fs,
        dir,
        message: `message ${index + 1}`,
        author: {
          name: "author name",
          email: "author email",
        },
      });
      await Deno.stdout.write(encoder.encode("."));
    }
    console.log("done");
  }

  // deno-lint-ignore no-inner-declarations
  async function commitStat(oid: string, oidPrev: string) {
    type FileStat = { filePath: string; status: string };
    const trees = [git.TREE({ ref: oid }), git.TREE({ ref: oidPrev })];
    const files: FileStat[] = await git.walk({
      fs,
      dir,
      cache,
      trees,
      map: async (filePath, treeEntries): Promise<FileStat | undefined | null> => {
        const [entry, entryPrev] = treeEntries;
        const type = await entry?.type();
        const typePrev = await entryPrev?.type();
        if (type === "blob" || typePrev === "blob") {
          const oid = await entry?.oid();
          const oidPrev = await entryPrev?.oid();
          if (oidPrev === undefined) {
            return { filePath, status: "added" };
          }
          if (oid === undefined) {
            return { filePath, status: "removed" };
          }
          if (oid !== oidPrev) {
            return { filePath, status: "changed" };
          }
        }
        return undefined;
      },
    });
    return files;
  }

  const startTimeLog = performance.now();
  {
    let numOfCommits = 0;
    let startAt = gitBranch;
    const limitBy = chunkGitLogs;
    while (true) {
      await Deno.stdout.write(encoder.encode("."));
      const commits = await git.log({ fs, dir, cache, ref: startAt, depth: limitBy });
      if (commits.length === 0) {
        break;
      }

      for (let index = 0; index < commits.length; index += 1) {
        const commit = commits[index];
        const commitPrev = commits[index + 1];
        const date = new Date(commit.commit.author.timestamp * 1000);
        const message = commit.commit.message;
        if (commit && commitPrev) {
          const stat = await commitStat(commit?.commit?.tree, commitPrev?.commit?.tree);
          // console.log([date, message, stat]);
          [date, message, stat];
        }
      }

      const lastCommit = commits.slice(-1)[0];
      const nextStartAt = lastCommit.oid;
      if (nextStartAt === startAt) {
        break;
      }
      numOfCommits += commits.length - (startAt === gitBranch ? 0 : 1);
      startAt = nextStartAt;
    }
    console.log(numOfCommits);
  }

  console.log("time (log):", Fmt.millisDiff(startTimeLog, performance.now(), "millis"));
  console.log("time:", Fmt.millisDiff(startTime, performance.now(), "millis"));
}
