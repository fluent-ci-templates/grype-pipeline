# Grype Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgrype_pipeline&query=%24.version)](https://pkg.fluentci.io/grype_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/grype-pipeline)](https://codecov.io/gh/fluent-ci-templates/grype-pipeline)

A ready-to-use CI/CD Pipeline for scanning vulnerabilities in your project with Grype.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci grype_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t grype
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Environment variables

| Variable                | Description                                       |
| ----------------------- | ------------------------------------------------- |
| GRYPE_IMAGE             | The image to scan                                 |
| GRYPE_VERSION           | The version of Grype to use. Defaults to `latest` |
| GRYPE_FAIL_ON           | Set the return code to 1 if a vulnerability is found with a severity >= the given severity. Possible values: `negligible`, `low`, `medium`, `high`, `critical` |

## Jobs

| Job      | Description                  |
| -------- | ---------------------------- |
| scan     | Scan for vulnerabilities     |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { scan } from "https://pkg.fluentci.io/grype_pipeline@v0.2.0/mod.ts";

await scan();
```
