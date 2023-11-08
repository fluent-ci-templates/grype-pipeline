import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("Grype");

  const push = {
    branches: ["main"],
  };

  const scan: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v3",
      },
      {
        name: "Setup Fluent CI",
        run: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run grype_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ scan });

  return workflow;
}
