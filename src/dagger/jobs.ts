/**
 * @module grype
 * @description This module provides a set of functions to scan a directory or image for vulnerabilities using Grype.
 */

import { Directory, dag, env } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  scan = "scan",
}

export const exclude = [".git", ".fluentci", ".devbox"];

const GRYPE_VERSION = env.get("GRYPE_VERSION") || "latest";

/**
 * Scan a directory or image for vulnerabilities
 *
 * @function
 * @description Scan a directory or image for vulnerabilities
 * @param {Directory | string} src The context directory
 * @param {string} [image] The image to scan
 * @returns {Promise<string>}
 */
export async function scan(
  src: Directory | string,
  image?: string,
  failOn?: string
): Promise<string> {
  const GRYPE_IMAGE =
    env.get("GRYPE_IMAGE") ||
    env.get("GRYPE_DIR") ||
    env.get("GRYPE_SBOM") ||
    image ||
    `dir:${src}`;
  const GRYPE_FAIL_ON = env.get("GRYPE_FAIL_ON") || failOn;
  const context = await getDirectory(src);
  let args = [
    env.has("GRYPE_SBOM") && !env.get("GRYPE_SBOM")!.startsWith("sbom:")
      ? `sbom:${env.get("GRYPE_SBOM")}`
      : GRYPE_IMAGE,
  ];

  if (GRYPE_FAIL_ON) {
    args = args.concat(["--fail-on", GRYPE_FAIL_ON]);
  }

  const ctr = dag
    .pipeline(Job.scan)
    .container()
    .from(`anchore/grype:${GRYPE_VERSION}`)
    .withMountedCache("/root/.cache/grype", dag.cacheVolume("grype-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  return ctr.stdout();
}

export type JobExec = (
  src: Directory | string,
  image?: string,
  failOn?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.scan]: scan,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.scan]: "Scan for vulnerabilities",
};
