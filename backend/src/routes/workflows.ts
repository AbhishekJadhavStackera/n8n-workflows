import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { enqueueWorkflow } from "../services/queue";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /workflows
 * body: { name, slug, path, json }
 */
router.post("/", requireAuth, async (req: any, res) => {
  const tenantId = req.tenantId;
  const { name, slug, path: wfPath, json } = req.body;
  if (!name || !slug || !json) return res.status(400).json({ error: "name,slug,json required" });
  const wf = await prisma.workflow.create({
    data: { tenantId, name, slug, path: wfPath, json },
  });
  res.json(wf);
});

/**
 * POST /workflows/:id/execute
 * body: arbitrary input
 */
router.post("/:id/execute", requireAuth, async (req: any, res) => {
  const tenantId = req.tenantId;
  const wf = await prisma.workflow.findUnique({ where: { id: req.params.id } });
  if (!wf || wf.tenantId !== tenantId) return res.status(404).json({ error: "not found" });
  const exec = await enqueueWorkflow({ workflowId: wf.id, tenantId, input: req.body });
  res.json(exec);
});

/**
 * GET /workflows/:id
 */
router.get("/:id", requireAuth, async (req: any, res) => {
  const tenantId = req.tenantId;
  const wf = await prisma.workflow.findUnique({ where: { id: req.params.id } });
  if (!wf || wf.tenantId !== tenantId) return res.status(404).json({ error: "not found" });
  res.json(wf);
});

export default router;
