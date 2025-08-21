import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import type { Workflow } from "@/lib/types"

interface WorkflowDescriptionProps {
  workflow: Workflow
}

export function WorkflowDescription({ workflow }: WorkflowDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-work-sans">About this workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{workflow.description}</p>
      </CardContent>
    </Card>
  )
}
