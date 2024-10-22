# 2024-kubernetes-datavis

> [!NOTE]
> Status: This project is in early development.

### Usage:

install deno.

- `❯ brew install deno`
- more: https://github.com/denoland/deno#installation

run deno tasks:

- `❯ deno task run:manifests-git`
- `❯ deno task run:manifests-plot`

### Manifests repository directory schema:

```
applications/<application-name>/
. application-namespace.json
. releases/<release-number>/
. . release-author.json
. . release-commit.json
. . release-date.json
. . release-message.json
. . environments/development/
. . . manifests.yaml
. . environments/staging/
. . environments/production/
environments/
. development/
. . applications/<application-name>/
. . . release-number.json
. staging/
. production/
```
