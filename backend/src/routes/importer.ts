import { Router } from "express";
import {
  sanitizeWorkflowForImport,
  extractCredentialRefs,
  buildCredentialPayloadFromTemplate,
  createCredentialOnN8n,
  bindCredentialsToWorkflow,
  importWorkflowToN8n,
} from "../lib/n8nImporter";

const router = Router();

/**
 * POST /integrations/preview
 * body: { exportedWorkflow }
 * returns: { sanitized, credentialRefs }
 */
router.post("/preview", async (req, res) => {
  const { exportedWorkflow } = req.body;
  if (!exportedWorkflow) return res.status(400).json({ error: "missing exportedWorkflow" });
  try {
    const sanitized = sanitizeWorkflowForImport(exportedWorkflow);
    const refs = extractCredentialRefs(exportedWorkflow);
    res.json({ sanitized, credentialRefs: refs });
  } catch (err: any) {
    console.error("preview error", err);
    res.status(500).json({ error: String(err?.message ?? err) });
  }
});

/**
 * POST /integrations/import
 * body:
 * {
 *   n8nUrl, n8nApiKey, exportedWorkflow,
 *   credentialBindings: { "<nodeName>::<credType>": { template, values } | { rawPayload } },
 *   activate: boolean
 * }
 */
router.post("/import", async (req, res) => {
  const { n8nUrl, n8nApiKey, exportedWorkflow, credentialBindings = {}, activate = false } = req.body;
  if (!n8nUrl || !n8nApiKey || !exportedWorkflow) return res.status(400).json({ error: "missing params" });

  try {
    const sanitized = sanitizeWorkflowForImport(exportedWorkflow);
    const refs = extractCredentialRefs(exportedWorkflow);

    const bindingMap: Record<string, string> = {};

    // create credentials on n8n if provided
    for (const key of Object.keys(credentialBindings)) {
      const binding = credentialBindings[key];
      let payload;
      if (binding.rawPayload) payload = binding.rawPayload;
      else payload = buildCredentialPayloadFromTemplate(binding);
      const created = await createCredentialOnN8n(n8nUrl, n8nApiKey, payload);
      if (!created || !created.id) {
        return res.status(500).json({ error: "credential creation failed", detail: created });
      }
      bindingMap[key] = created.id;
    }

    const bound = bindCredentialsToWorkflow(sanitized, bindingMap);

    const result = await importWorkflowToN8n(n8nUrl, n8nApiKey, bound, activate);
    if (!result.success) return res.status(400).json({ error: "import_failed", cause: result.errors });

    res.json({ success: true, workflow: result.workflow, webhookUrls: result.webhookUrls, credentialRefs: refs });
  } catch (err: any) {
    console.error("import error", err);
    res.status(500).json({ error: String(err?.message ?? err) });
  }
});

export default router;
