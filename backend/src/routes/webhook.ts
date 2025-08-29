import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { enqueueWorkflow } from "../services/queue";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /webhook/:path
 * Quick webhook endpoint to trigger a workflow by its configured path field.
 */
router.post("/:path", async (req, res) => {
  const wf = await prisma.workflow.findFirst({ where: { path: req.params.path } });
  if (!wf) return res.status(404).json({ error: "workflow not found" });
  await enqueueWorkflow({ workflowId: wf.id, tenantId: wf.tenantId, input: req.body });
  // Immediate ack; execution handled async by worker
  res.json({ enqueued: true });
});

export default router;
