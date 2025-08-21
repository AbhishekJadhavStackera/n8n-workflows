"use client"

import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { workflowJSONData } from "@/lib/workflow-data"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface WorkflowJSONProps {
  workflowId: string
}

export function WorkflowJSON({ workflowId }: WorkflowJSONProps) {
  const [copied, setCopied] = useState(false)

  const workflowData = workflowJSONData[workflowId] || {
    name: "Sample Workflow",
    nodes: [],
    connections: {},
    active: false,
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-work-sans font-semibold">Workflow JSON</h3>
          <Badge variant="outline" className="text-xs">
            n8n Format
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-auto">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
          {JSON.stringify(workflowData, null, 2)}
        </pre>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          This JSON can be imported directly into n8n. Make sure to configure your credentials and API keys before
          activating the workflow.
        </p>
      </div>
    </div>
  )
}
