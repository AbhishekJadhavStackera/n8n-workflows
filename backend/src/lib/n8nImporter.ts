import fetch from "node-fetch";
import { z } from "zod";

/**
 * n8n Importer
 * - sanitize exported workflow JSON for import
 * - extract credential refs
 * - credential template builders + create via n8n API
 * - import workflow via n8n API
 */

/* Types */
export type WorkflowExport = any;
export type CredentialRef = {
  credentialType: string;
  nodeName: string;
  rawRef: any;
  placeholder: string;
};
export type ImportResult = {
  success: boolean;
  workflow?: any;
  webhookUrls?: string[];
  errors?: any;
};

/* Sanitizer/extractor */
const allowedTop = new Set([
  "name",
  "nodes",
  "connections",
  "settings",
  "tags",
  "versionId",
  "active",
  "icon",
  "notes",
]);

export function sanitizeWorkflowForImport(exported: WorkflowExport) {
  const sanitized: any = {};
  for (const k of Object.keys(exported || {})) {
    if (allowedTop.has(k)) sanitized[k] = exported[k];
  }

  sanitized.nodes = (sanitized.nodes || []).map((n: any) => {
    const node: any = {
      id: n.id || generateId(),
      name: n.name,
      type: n.type,
      typeVersion: n.typeVersion ?? 1,
      position: n.position ?? [0, 0],
      parameters: n.parameters ?? {},
    };
    if (n.notes) node.notes = n.notes;

    if (n.credentials) {
      node.credentials = {};
      for (const credType of Object.keys(n.credentials)) {
        const placeholder = `__CRED__::${node.name}::${credType}`;
        node.credentials[credType] = { id: null, name: placeholder, placeholder };
      }
    }
    return node;
  });

  sanitized.connections = sanitized.connections || exported?.connections || {};
  return sanitized;
}

export function extractCredentialRefs(exported: WorkflowExport): CredentialRef[] {
  const refs: CredentialRef[] = [];
  const nodes = exported?.nodes || [];
  for (const n of nodes) {
    if (!n.credentials) continue;
    for (const credType of Object.keys(n.credentials)) {
      const raw = n.credentials[credType];
      const placeholder = `__CRED__::${n.name}::${credType}`;
      refs.push({
        credentialType: credType,
        nodeName: n.name,
        rawRef: raw,
        placeholder,
      });
    }
  }
  return refs;
}

/* Credential templates (zod validation + builders) */

const openaiSchema = z.object({
  name: z.string().min(1).optional(),
  apiKey: z.string().min(1),
  organization: z.string().optional(),
});

const httpHeaderSchema = z.object({
  name: z.string().min(1).optional(),
  headerName: z.string().min(1),
  headerValue: z.string().min(1),
});

const oauth2Schema = z.object({
  name: z.string().min(1).optional(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  authUrl: z.string().url(),
  tokenUrl: z.string().url(),
  scope: z.string().optional(),
});

export type CredentialBindingInput =
  | { template: "openaiApi"; values: z.infer<typeof openaiSchema> }
  | { template: "httpHeaderAuth"; values: z.infer<typeof httpHeaderSchema> }
  | { template: "oauth2Api"; values: z.infer<typeof oauth2Schema> }
  | { rawPayload: any };

export function buildCredentialPayloadFromTemplate(binding: CredentialBindingInput) {
  if ("rawPayload" in binding) return binding.rawPayload;

  if (binding.template === "openaiApi") {
    const parsed = openaiSchema.parse(binding.values);
    const name = parsed.name || "OpenAI (imported)";
    return {
      name,
      type: "openaiApi",
      data: {
        apiKey: { value: parsed.apiKey },
        organization: { value: parsed.organization ?? "" },
      },
    };
  }

  if (binding.template === "httpHeaderAuth") {
    const parsed = httpHeaderSchema.parse(binding.values);
    const name = parsed.name || `Header ${parsed.headerName}`;
    return {
      name,
      type: "httpHeaderAuth",
      data: {
        headerName: { value: parsed.headerName },
        headerValue: { value: parsed.headerValue },
      },
    };
  }

  if (binding.template === "oauth2Api") {
    const parsed = oauth2Schema.parse(binding.values);
    const name = parsed.name || "OAuth2 (imported)";
    return {
      name,
      type: "oAuth2Api",
      data: {
        clientId: { value: parsed.clientId },
        clientSecret: { value: parsed.clientSecret },
        authUrl: { value: parsed.authUrl },
        tokenUrl: { value: parsed.tokenUrl },
        scope: { value: parsed.scope ?? "" },
      },
    };
  }

  throw new Error("unsupported credential template");
}

/* HTTP helpers for n8n API */

function trimBase(base: string) {
  return base.replace(/\/+$/, "");
}

export async function createCredentialOnN8n(n8nBaseUrl: string, apiKey: string, credentialPayload: any) {
  const url = `${trimBase(n8nBaseUrl)}/api/v1/credentials`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-N8N-API-KEY": apiKey },
    body: JSON.stringify(credentialPayload),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) throw { status: res.status, body: data };
  return data;
}

export async function importWorkflowToN8n(n8nBaseUrl: string, apiKey: string, sanitizedWorkflow: any, activate = false): Promise<ImportResult> {
  const url = `${trimBase(n8nBaseUrl)}/api/v1/workflows`;
  const payload = { ...sanitizedWorkflow };
  if (activate) payload.active = true;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-N8N-API-KEY": apiKey },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  if (!res.ok) return { success: false, errors: { status: res.status, body: json } };

  const webhookUrls = findWebhookUrlsFromWorkflow(json, n8nBaseUrl);
  return { success: true, workflow: json, webhookUrls };
}

export function bindCredentialsToWorkflow(sanitizedWorkflow: any, bindingMap: Record<string, string>) {
  const wf = JSON.parse(JSON.stringify(sanitizedWorkflow));
  for (const node of wf.nodes || []) {
    if (!node.credentials) continue;
    for (const credType of Object.keys(node.credentials)) {
      const placeholder = node.credentials[credType]?.placeholder ?? node.credentials[credType]?.name;
      if (!placeholder) continue;
      const key = placeholderToKey(placeholder);
      const credId = bindingMap[key];
      if (!credId) {
        node.credentials[credType] = undefined;
      } else {
        node.credentials[credType] = { id: credId };
      }
    }
  }
  return wf;
}

/* Helpers */

function placeholderToKey(placeholder: string) {
  return placeholder.replace(/^__CRED__::/, "");
}

function findWebhookUrlsFromWorkflow(apiResponseWorkflow: any, n8nBaseUrl: string) {
  const urls: string[] = [];
  const nodes = apiResponseWorkflow?.nodes ?? [];
  for (const node of nodes) {
    const type = (node.type || "").toLowerCase();
    if (type.includes("webhook") || (node.name && node.name.toLowerCase().includes("webhook"))) {
      if (node?.parameters?.path) {
        urls.push(`${trimBase(n8nBaseUrl)}/webhook/${node.parameters.path}`);
      } else if (node?.webhookId) {
        urls.push(`${trimBase(n8nBaseUrl)}/webhook/${node.webhookId}`);
      }
    }
  }
  return urls;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}
