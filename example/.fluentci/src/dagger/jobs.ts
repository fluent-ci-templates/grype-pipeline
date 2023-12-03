import Client, { Directory } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  scan = "scan",
}

export const exclude = [".git", ".fluentci", ".devbox"];

const GRYPE_VERSION = Deno.env.get("GRYPE_VERSION") || "latest";

/**
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
  await connect(async (client: Client) => {
    const GRYPE_IMAGE = Deno.env.get("GRYPE_IMAGE") || image || `dir:${src}`;
    const GRYPE_FAIL_ON = Deno.env.get("GRYPE_FAIL_ON") || failOn;
    const context = getDirectory(client, src);
    let args = [GRYPE_IMAGE];

    if (GRYPE_FAIL_ON) {
      args = args.concat(["--fail-on", GRYPE_FAIL_ON]);
    }

    const ctr = client
      .pipeline(Job.scan)
      .container()
      .from(`anchore/grype:${GRYPE_VERSION}`)
      .withMountedCache("/root/.cache/grype", client.cacheVolume("grype-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(args);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
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
