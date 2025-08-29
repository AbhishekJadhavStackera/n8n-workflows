import fetch from "node-fetch";

type Node = {
  name: string;
  type: string;
  parameters?: any;
  next?: string | null;
};

export async function executeWorkflow(wfJson: any, input: any) {
  const nodes: Node[] = wfJson.nodes || [];
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
        const res = await fetch(url, { method, body: body ? JSON.stringify(body) : undefined, timeout: 15000 });
        const json = await res.json().catch(() => ({ status: res.status, text: "non-json" }));
        data = { ...data, httpResponse: json };
        break;
      }
      case "respond":
        return node.parameters?.response || data;
      default:
        throw new Error("unsupported node type: " + node.type);
    }
    current = node.next as any;
  }
  return data;
}
