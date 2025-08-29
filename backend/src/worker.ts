import { Worker } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { runInSandbox } from "./services/sandbox";
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const prisma = new PrismaClient();

const worker = new Worker("workflow-queue", async job => {
  const { executionId, workflowId, input } = job.data;
  await prisma.execution.update({ where: { id: executionId }, data: { status: "running" } });
  try {
    const wf = await prisma.workflow.findUnique({ where: { id: workflowId } });
    if (!wf) throw new Error("workflow not found");
    // Run inside sandbox container
    const res = await runInSandbox(executionId, wf.json, input, { timeoutMs: 20000, memory: "256m", cpus: "0.5" });
    if (!res.success) {
      await prisma.execution.update({ where: { id: executionId }, data: { status: "failed", error: String(res.error).slice(0, 2000) } });
      throw new Error(String(res.error));
    } else {
      await prisma.execution.update({ where: { id: executionId }, data: { status: "success", output: res.output } });
    }
  } catch (err: any) {
    await prisma.execution.update({ where: { id: executionId }, data: { status: "failed", error: String(err?.message || err).slice(0, 2000) } });
    throw err;
  }
}, { connection });

worker.on("failed", (job, err) => {
  console.error("job failed", job?.id, err);
});
