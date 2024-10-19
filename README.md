# 2024-kubernetes-datavis

> [!NOTE]
> This project is in early development.

### Usage:

- `deno task git`
- `deno task plot`

### Manifest repository directory schema:

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
