import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import type { Workflow } from "@/lib/types"
import { ExternalLink, Play, Settings } from "lucide-react"

interface WorkflowSetupGuideProps {
  workflow: Workflow
}

export function WorkflowSetupGuide({ workflow }: WorkflowSetupGuideProps) {
  return (
    <div className="space-y-6">
      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">Quick Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="outline" className="text-xs">
              {workflow.category}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Nodes</span>
            <span className="text-sm font-medium">{workflow.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm font-medium">{new Date(workflow.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Required Nodes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">Required Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workflow.nodes.map((node) => (
              <div key={node} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium">{node}</span>
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">How to set it up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Download the workflow</p>
                <p className="text-xs text-muted-foreground">Click the download button to get the JSON file</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Import to n8n</p>
                <p className="text-xs text-muted-foreground">Open n8n and import the workflow file</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Configure credentials</p>
                <p className="text-xs text-muted-foreground">Set up API keys and authentication</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="text-sm font-medium">Test and activate</p>
                <p className="text-xs text-muted-foreground">Run a test and activate the workflow</p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Configuration Guide
            </Button>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              n8n Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-work-sans font-semibold text-foreground">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground">
              Download this workflow and start automating your processes today.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Play className="h-4 w-4 mr-2" />
              Get This Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
