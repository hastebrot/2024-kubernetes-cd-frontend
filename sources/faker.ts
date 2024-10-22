import { randFullName, randGitCommitSha } from "@ngneat/falso";
import { mapRange, Rand } from "./helper.ts";

export const randomEnvironmentName = () => {
  return Rand.item(environmentNames);
};

export const randomNamespaceName = () => {
  return Rand.item(namespaceNames);
};

export const randomApplicationName = () => {
  return `${Rand.item(applicationNames)}-${Rand.number(10, 99)}`;
};

export const randomGitCommit = () => {
  return randGitCommitSha();
};

export const randomGitAuthor = () => {
  return randFullName({ withAccents: false });
};

export const randomTextSentence = (
  minWords: number,
  maxWords: number,
  minWordLength: number,
  maxWordLength: number,
) => {
  const text = mapRange(
    Rand.number(minWords, maxWords),
    () => Rand.string(Rand.number(minWordLength, maxWordLength)),
  ).join(" ");
  return text.slice(0, 1).toUpperCase() + text.slice(1) + ".";
};

export type ManifestYamlData = {
  applicationName: string;
  applicationNamespace: string;
  gitCommit: string;
};

export const produceManifestYaml = (data: ManifestYamlData) => {
  return manifestYamlTemplate.trim()
    .replaceAll(/\$applicationNamespace/g, data.applicationNamespace)
    .replaceAll(/\$applicationName/g, data.applicationName)
    .replaceAll(/\$gitCommit/g, data.gitCommit)
    .replaceAll(/\$loremIpsumText/g, randomTextSentence(6, 6, 6, 12));
};

const environmentNames = [
  "feature",
  "development",
  "testing",
  "staging",
  "production",
];

const namespaceNames = [
  "abc",
  "def",
  "ghi",
  "jkl",
  "mno",
  "xyz",
];

const applicationNames = [
  "api-gateway",
  "assignment",
  "auditing",
  "auth",
  "booking",
  "broker",
  "broker-ui",
  "components",
  "configuration",
  "configuration-ui",
  "echo",
  "invoice",
  "launchpad",
  "location",
  "monitor",
  "monitor-ui",
  "notification",
  "notification-ui",
  "operation",
  "order",
  "policy",
  "policy-ui",
  "repricing",
  "settings",
  "status",
  "system-test",
];

const manifestYamlTemplate = `
apiVersion: v1
kind: ConfigMap
metadata:
  name: $applicationName
  namespace: $applicationNamespace
---
apiVersion: v1
kind: Service
metadata:
  name: $applicationName
  namespace: $applicationNamespace
spec:
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $applicationName
  namespace: $applicationNamespace
  labels:
    app: $applicationName
    service: $applicationNamespace.$applicationName
    version: $gitCommit
spec:
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
  - $loremIpsumText
`;

if (import.meta.main) {
  const manifestYaml = produceManifestYaml({
    applicationName: randomApplicationName(),
    applicationNamespace: randomNamespaceName(),
    gitCommit: randomGitCommit(),
  });
  console.log(manifestYaml);
}
