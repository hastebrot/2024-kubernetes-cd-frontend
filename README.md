# 2024-kubernetes-datavis

> [!NOTE]
> Status: This project is in early development.

### Usage:

install deno.

- `❯ brew install deno`
- more: https://github.com/denoland/deno#installation

run deno tasks:

- `❯ deno task manifests-git`
- `❯ deno task manifests-plot`

### Manifests repository directory schema:

```
applications/<application-name>/
. application-namespace.txt
. releases/<release-number>/
. . release-author.txt
. . release-commit.txt
. . release-date.txt
. . release-message.txt
. . environments/development/
. . . manifests.yaml
. . environments/staging/
. . environments/production/
environments/
. development/
. . applications/<application-name>/
. . . release-number.txt
. staging/
. production/
```
