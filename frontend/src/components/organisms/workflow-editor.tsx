"use client"

// import { Badge } from "@/components/atoms/badge"
// import { Button } from "@/components/atoms/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs"
// import { WorkflowCanvas } from "@/components/molecules/workflow-canvas"
// import { WorkflowJSON } from "@/components/molecules/workflow-json"
// import { Copy, Download, ExternalLink, Maximize2 } from "lucide-react"
// import { useState } from "react"
// import { ConnectionView, NodeView } from "n8n-editor-ui"

interface WorkflowEditorProps {
  workflowId: string
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  return (
     <iframe
        src={`${process.env.NEXT_PUBLIC_N8N_HOST}/workflow/new`}
        width="100%"
        height="24rem"
        className="h-96 w-full border border-border rounded-lg overflow-hidden bg-background"
    />
  );
}

// export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
//   const [nodes, setNodes] = useState([]);
//   const [connections, setConnections] = useState([]);

//   return (
//     <div className="workflow-canvas">
//       <NodeView nodes={nodes} onNodeUpdate={setNodes} />
//       <ConnectionView connections={connections} />
//     </div>
//   );
// }

// export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
//   const [activeTab, setActiveTab] = useState("visual")
//   const [isFullscreen, setIsFullscreen] = useState(false)

//   const handleOpenInN8n = () => {
//     // This would open n8n in a new window/tab with the workflow loaded
//     window.open("https://n8n.io/workflows", "_blank")
//   }

//   const handleCopyJSON = () => {
//     // Copy workflow JSON to clipboard
//     navigator.clipboard.writeText(JSON.stringify(sampleWorkflowData, null, 2))
//   }

//   const handleDownload = () => {
//     // Download workflow as JSON file
//     const blob = new Blob([JSON.stringify(sampleWorkflowData, null, 2)], {
//       type: "application/json",
//     })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${workflowId}-workflow.json`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   return (
//     <Card className={isFullscreen ? "fixed inset-4 z-50 bg-background" : ""}>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="font-work-sans">Workflow Editor</CardTitle>
//           <div className="flex items-center space-x-2">
//             <Badge variant="outline" className="text-xs">
//               Interactive Preview
//             </Badge>
//             <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
//               <Maximize2 className="h-4 w-4 mr-2" />
//               {isFullscreen ? "Exit" : "Full Screen"}
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <div className="px-6 pb-0">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="visual">Visual Editor</TabsTrigger>
//               <TabsTrigger value="json">JSON View</TabsTrigger>
//               <TabsTrigger value="n8n">Open in n8n</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="visual" className="mt-0">
//             <div className="p-6">
//               <WorkflowCanvas workflowId={workflowId} />
//             </div>
//           </TabsContent>

//           <TabsContent value="json" className="mt-0">
//             <div className="p-6">
//               <WorkflowJSON workflowId={workflowId} />
//             </div>
//           </TabsContent>

//           <TabsContent value="n8n" className="mt-0">
//             <div className="p-6">
//               <div className="text-center space-y-4 py-8">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
//                   <ExternalLink className="h-8 w-8 text-primary" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="font-work-sans font-semibold text-foreground">Open in n8n</h3>
//                   <p className="text-sm text-muted-foreground max-w-md mx-auto">
//                     For the full n8n editing experience, open this workflow in your n8n instance or n8n Cloud.
//                   </p>
//                 </div>
//                 <div className="flex justify-center space-x-2">
//                   <Button onClick={handleOpenInN8n} className="bg-primary hover:bg-primary/90 text-primary-foreground">
//                     <ExternalLink className="h-4 w-4 mr-2" />
//                     Open in n8n
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* Action Bar */}
//         <div className="border-t border-border p-4 bg-muted/30">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-muted-foreground">Workflow ready for import into n8n</div>
//             <div className="flex space-x-2">
//               <Button variant="outline" size="sm" onClick={handleCopyJSON}>
//                 <Copy className="h-4 w-4 mr-2" />
//                 Copy JSON
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleDownload}
//                 className="bg-primary hover:bg-primary/90 text-primary-foreground"
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Download
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// Sample workflow data structure

const sampleWorkflowData = {
  name: "Sample Workflow",
  nodes: [
    {
      parameters: {},
      id: "start-node",
      name: "Start",
      type: "n8n-nodes-base.start",
      typeVersion: 1,
      position: [240, 300],
    },
    {
      parameters: {
        httpMethod: "GET",
        url: "https://api.example.com/data",
      },
      id: "http-request",
      name: "HTTP Request",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 1,
      position: [460, 300],
    },
    {
      parameters: {
        conditions: {
          string: [
            {
              value1: "={{$json.status}}",
              operation: "equal",
              value2: "success",
            },
          ],
        },
      },
      id: "if-condition",
      name: "IF",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [680, 300],
    },
  ],
  connections: {
    Start: {
      main: [
        [
          {
            node: "HTTP Request",
            type: "main",
            index: 0,
          },
        ],
      ],
    },
    "HTTP Request": {
      main: [
        [
          {
            node: "IF",
            type: "main",
            index: 0,
          },
        ],
      ],
    },
  },
}
