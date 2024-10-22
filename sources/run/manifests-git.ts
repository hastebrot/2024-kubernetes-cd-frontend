import git from "isomorphic-git";
import fs from "node:fs/promises";
import {
  fakeApplicationName,
  fakeEnvironmentNames,
  fakeGitAuthor,
  fakeGitCommit,
  fakeGitMessage,
  fakeManifestYaml,
  fakeNamespaceName,
} from "../faker.ts";
import { Fmt, Json, mapRange, Rand, Zod } from "../helper.ts";
import { Application, Environment } from "../model.ts";

const gitDirectory = "./build/manifests-repo/";
const gitBranch = "main";
const chunkGitCommits = 100;
const chunkGitLogs = 100;

if (import.meta.main) {
  const dir = gitDirectory;
  const cache = {};
  const encoder = new TextEncoder();
  const _decoder = new TextDecoder();

  const uniqueItems = <T>(items: T[]): T[] => Array.from(new Set(items));
  const environments = fakeEnvironmentNames().map((environmentName) => {
    return {
      environmentName,
    };
  });
  const applications = uniqueItems(mapRange(100, () => {
    const namespaceName = fakeNamespaceName();
    return {
      applicationName: `${namespaceName}-${fakeApplicationName()}`,
      namespaceName,
    };
  }));
  const gitAuthors = uniqueItems(mapRange(20, () => {
    return fakeGitAuthor();
  }));

  {
    await git.init({ fs, dir, defaultBranch: gitBranch });
    const branch = await git.currentBranch({ fs, dir, fullname: true });
    console.log("dir:", dir);
    console.log("branch:", branch);
  }

  {
    const startTime = performance.now();
    let countOfCommits = 0;
    await fs.mkdir(dir + `applications/`, { recursive: true });
    await fs.mkdir(dir + `environments/`, { recursive: true });
    for (let index = 0; index < chunkGitCommits; index += 1) {
      const releaseNumber = Rand.number(1, 10);
      const application = Zod.parseStrict(Application, Rand.item(applications));
      const environment = Zod.parseStrict(Environment, Rand.item(environments));
      const releaseCommit = fakeGitCommit();
      const releaseDate = new Date().toISOString();

      const applicationPath = `applications/${application.applicationName}/`;
      const environmentPath = `environments/${environment.environmentName}/`;
      const releasePath = `releases/${releaseNumber}/`;

      await fs.mkdir(
        dir + applicationPath + releasePath + environmentPath,
        { recursive: true },
      );
      await fs.mkdir(
        dir + environmentPath + applicationPath,
        { recursive: true },
      );
      await fs.writeFile(
        dir + applicationPath + "application-namespace.json",
        Json.write(application.namespaceName),
      );
      await fs.writeFile(
        dir + applicationPath + releasePath + "release-message.json",
        Json.write(fakeGitMessage(application.namespaceName)),
      );
      await fs.writeFile(
        dir + applicationPath + releasePath + "release-author.json",
        Json.write(Rand.item(gitAuthors)),
      );
      await fs.writeFile(
        dir + applicationPath + releasePath + "release-commit.json",
        Json.write(releaseCommit),
      );
      await fs.writeFile(
        dir + applicationPath + releasePath + "release-date.json",
        Json.write(releaseDate),
      );
      await fs.writeFile(
        dir + applicationPath + releasePath + environmentPath + "manifests.yaml",
        fakeManifestYaml({
          applicationName: application.applicationName,
          applicationNamespace: application.namespaceName,
          gitCommit: releaseCommit,
        }),
      );
      await fs.writeFile(
        dir + environmentPath + applicationPath + "release-number.json",
        Json.write(releaseNumber),
      );
      await fs.writeFile(
        dir + environmentPath + applicationPath + "manifests.yaml",
        fakeManifestYaml({
          applicationName: application.applicationName,
          applicationNamespace: application.namespaceName,
          gitCommit: releaseCommit,
        }),
      );
      await git.add({ fs, dir, filepath: "." });
      await git.commit({
        fs,
        dir,
        message: `Release ${releaseNumber} of ${application.applicationName}.`,
        author: { name: "", email: "" },
        committer: { name: "", email: "" },
      });
      countOfCommits += 1;
      await Deno.stdout.write(encoder.encode("."));
    }
    console.log(countOfCommits);
    const stopTime = performance.now();
    console.log(
      "time (git commit --all):",
      Fmt.millis(stopTime - startTime, "millis"),
      "total,",
      Fmt.millis((stopTime - startTime) / countOfCommits, "micros"),
      "per commit",
    );
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

  {
    const startTime = performance.now();
    let countOfCommits = 0;
    let startAt = gitBranch;
    const limitBy = chunkGitLogs;
    while (true) {
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
      countOfCommits += commits.length - (startAt === gitBranch ? 0 : 1);
      startAt = nextStartAt;
      await Deno.stdout.write(encoder.encode("."));
    }
    console.log(countOfCommits);
    const stopTime = performance.now();
    console.log(
      "time (git log --stat):",
      Fmt.millis(stopTime - startTime, "millis"),
      "total,",
      Fmt.millis((stopTime - startTime) / countOfCommits, "micros"),
      "per commit",
    );
  }
}
