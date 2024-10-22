import { z } from "zod";
import { Zod } from "./helper.ts";

export type Environment = z.output<typeof Environment>;
export const Environment = Zod.object("Environment", {
  environmentName: z.string(),
});

export type Application = z.output<typeof Application>;
export const Application = Zod.object("Application", {
  applicationName: z.string(),
  namespace: z.string(),
});

export type Release = z.output<typeof Release>;
export const Release = Zod.object("Release", {
  applicationName: z.string(),
  releaseNumber: z.string(),
  gitCommit: z.string(),
  gitMessage: z.string(),
  gitAuthor: z.string(),
  gitDate: z.string(),
  environments: z.array(z.object({
    environmentName: z.string(),
    manifestYaml: z.string().optional(),
  })),
});

export type Deployment = z.output<typeof Deployment>;
export const Deployment = Zod.object("Deployment", {
  environmentName: z.string(),
  applicationName: z.string(),
  releaseNumber: z.string(),
});

if (import.meta.main) {
  const release = Zod.parseStrict(Release, {
    applicationName: "application name",
    releaseNumber: "1",
    gitCommit: "commit",
    gitMessage: "message",
    gitAuthor: "author",
    gitDate: new Date().toISOString(),
    environments: [],
  });
  console.log(release);
}
