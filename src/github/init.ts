import { generateYaml } from "./config.ts";

generateYaml().save(".github/workflows/grype.yml");
