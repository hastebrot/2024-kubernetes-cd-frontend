import { randFullName, randGitCommitSha } from "@ngneat/falso";
import { mapRange, Rand } from "./helper.ts";

export const fakeEnvironmentNames = () => {
  return environmentNames;
};

export const fakeEnvironmentName = () => {
  return Rand.item(environmentNames);
};

export const fakeNamespaceNames = () => {
  return namespaceNames;
};

export const fakeNamespaceName = () => {
  return Rand.item(namespaceNames);
};

export const fakeApplicationName = () => {
  return `${Rand.item(applicationNames)}-${Rand.number(10, 99)}`;
};

export const fakeGitCommit = () => {
  return randGitCommitSha();
};

export const fakeGitAuthor = () => {
  return randFullName({ withAccents: false });
};

export const fakeGitMessage = (namespaceName: string) => {
  const ticketId = `${namespaceName.toUpperCase()}-${Rand.number(1000, 9999)}`;
  const ticketType = Rand.item(["feature", "bugfix"]);
  return `[${ticketId}] ${ticketType}: ${fakeTextSentence(5, 10, 5, 10)}`;
};

export const fakeTextSentence = (
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

export const fakeManifestYaml = (data: ManifestYamlData) => {
  return manifestYamlTemplate.trimStart()
    .replaceAll(/\$applicationNamespace/g, data.applicationNamespace)
    .replaceAll(/\$applicationName/g, data.applicationName)
    .replaceAll(/\$gitCommit/g, data.gitCommit)
    .replaceAll(/\$loremIpsumText/g, fakeTextSentence(6, 6, 6, 12));
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
