// backend/src/services/sandbox.ts
import { exec as execChild } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
const exec = util.promisify(execChild);

export type SandboxOptions = {
  timeoutMs?: number;
  memory?: string; // e.g. "256m"
  cpus?: string; // e.g. "0.5"
};

function safeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_\-]/g, "_");
}

/**
 * Normalize a host path so Docker on Windows can accept it when invoked from a Linux container.
 * Examples:
 *  - "C:\Users\me\project" -> "/c/Users/me/project"
 *  - "/home/me/project" -> "/home/me/project" (unchanged)
 */
function normalizeHostPathForDocker(p: string) {
  if (!p) return p;
  // Normalize backslashes to forward slashes first
  let np = p.replace(/\\/g, "/");

  // Detect Windows drive letter e.g. C:/Users/...
  const driveMatch = np.match(/^([A-Za-z]):\/(.*)/);
  if (driveMatch) {
    const drive = driveMatch[1].toLowerCase();
    const rest = driveMatch[2];
    // docker expects /c/Users/... (or //c/Users/...); /c/... works in most setups
    return `/${drive}/${rest}`;
  }

  // If path already absolute unix-style, return as-is
  return np;
}

export async function runInSandbox(executionId: string, wfJson: any, input: any, opts: SandboxOptions = {}) {
  // Host-accessible base dir (should be set in docker-compose)
  const hostBaseEnv = process.env.SANDBOX_HOST_DIR || process.env.SANDBOX_HOST || "";
  const hostBase = hostBaseEnv || os.tmpdir();

  // Build host temp dir path (hostBase should be an absolute host path)
  const dirName = `wf-run-${safeId(executionId)}`;
  const tmpDirHost = path.join(hostBase.replace(/\/+$/,""), dirName);

  // Ensure directory exists on container filesystem (if hostBase is mounted into container)
  fs.mkdirSync(tmpDirHost, { recursive: true });

  const fname = `exec-${executionId}.json`;
  const fpathHost = path.join(tmpDirHost, fname);

  fs.writeFileSync(fpathHost, JSON.stringify({ wfJson, input }, null, 2), "utf-8");

  const containerName = `wf_run_${safeId(executionId)}`;
  const memory = opts.memory || "256m";
  const cpus = opts.cpus || "0.5";
  const timeoutMs = opts.timeoutMs || 30000;

  // Normalize the host path for docker (handles Windows host paths)
  const hostPathToMount = normalizeHostPathForDocker(tmpDirHost);

  // Quote the hostPath to be safe (wrap in single quotes)
  // Note: exec runs via /bin/sh -c; single quotes protect special chars on Unix.
  // We'll use JSON.stringify to produce a safely quoted argument.
  const quotedHostMount = hostPathToMount.includes("'") ? `"${hostPathToMount}"` : `'${hostPathToMount}'`;

  const cmd = [
    "docker", "run", "--rm",
    "--name", containerName,
    "--network", "none",
    "--memory", memory,
    "--cpus", cpus,
    "-v", `${hostPathToMount}:/work`,
    "wf-runner:latest",
    "node", `/work/${fname}`
  ].join(" ");

  try {
    const promise = exec(cmd, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 });
    const { stdout, stderr } = await promise;
    try { fs.rmSync(tmpDirHost, { recursive: true, force: true }); } catch (e) {}
    if (stderr && stderr.trim()) {
      return { success: false, error: stderr.trim(), stdout };
    }
    try {
      const out = JSON.parse(stdout);
      return { success: true, output: out };
    } catch {
      return { success: true, output: stdout };
    }
  } catch (err: any) {
    try { await exec(`docker rm -f ${containerName}`).catch(() => {}); } catch (e) {}
    try { fs.rmSync(tmpDirHost, { recursive: true, force: true }); } catch (e) {}
    return { success: false, error: String(err && err.message ? err.message : err) };
  }
}
