// Minimal runner script executed inside sandbox container.
import fs from "fs";

async function main() {
  try {
    const execFile = process.argv[2];
    if (!execFile) {
      console.error("No exec file provided");
      process.exit(2);
    }
    const raw = fs.readFileSync(execFile, "utf-8");
    const payload = JSON.parse(raw);
    const { wfJson, input } = payload;
    const out = await execute(wfJson, input);
    console.log(JSON.stringify(out));
  } catch (err) {
    console.error("runner error:", err && err.message ? err.message : String(err));
    process.exit(3);
  }
}

async function execute(wfJson, input) {
  const nodes = wfJson.nodes || [];
  const nodeMap = new Map(nodes.map(n => [n.name, n]));
  let data = { input };
  let current = wfJson.startNode || nodes[0]?.name;
  let safetyCounter = 0;
  while (current && safetyCounter++ < 50) {
    const node = nodeMap.get(current);
    if (!node) break;
    switch (node.type) {
      case "set":
        data = { ...data, ...(node.parameters?.values || {}) };
        break;
      case "httpRequest": {
        const { url, method = "GET", body } = node.parameters || {};
        try {
          const res = await fetch(url, { method, body: body ? JSON.stringify(body) : undefined });
          const json = await res.json().catch(() => null);
          data = { ...data, httpResponse: json ?? { status: res.status } };
        } catch (e) {
          data = { ...data, httpResponse: { error: String(e && e.message ? e.message : e) } };
        }
        break;
      }
      case "respond":
        return node.parameters?.response || data;
      default:
        throw new Error("unsupported node type: " + node.type);
    }
    current = node.next;
  }
  return data;
}

main();
