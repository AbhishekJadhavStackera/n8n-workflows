import { Queue } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
export const wfQueue = new Queue("workflow-queue", { connection: redis });
const prisma = new PrismaClient();

export async function enqueueWorkflow({ workflowId, tenantId, input }: any) {
  const exec = await prisma.execution.create({
    data: { workflowId, status: "pending", input },
  });
  await wfQueue.add("run", { executionId: exec.id, workflowId, tenantId, input }, { attempts: 3, backoff: { type: "exponential", delay: 500 } });
  return exec;
}
