import { Rand } from "./helper.ts";

export const randomNamespaceName = () => {
  return Rand.item(namespaceNames);
};

export const randomEnvironmentName = () => {
  return Rand.item(environmentNames);
};

export const randomApplicationName = () => {
  return Rand.item(applicationNames);
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
