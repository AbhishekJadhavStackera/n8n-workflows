"use client"

import { WorkflowNode } from "@/components/atoms/workflow-node"
import { workflowJSONData } from "@/lib/workflow-data"
import {
    addEdge,
    Background,
    BackgroundVariant,
    type Connection,
    Controls,
    type Edge,
    EdgeMouseHandler,
    MiniMap,
    type Node,
    NodeChange,
    OnConnect,
    ReactFlow,
    ReactFlowInstance,
    useEdgesState,
    useNodesState
} from "@xyflow/react"
import '@xyflow/react/dist/style.css'
import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from 'sonner'

const nodeTypes = {
  workflowNode: WorkflowNode,
}

interface WorkflowCanvasProps {
  workflowId: string
}

function generateNodesAndEdges(workflowId: string) {
  const workflowData = workflowJSONData[workflowId]

  if (!workflowData) {
    return { nodes: [], edges: [] }
  }

  const nodes: Node[] = workflowData.nodes.map((node: any, index: number) => ({
    id: node.id,
    type: "workflowNode",
    position: node.position || { x: 100 + index * 200, y: 100 },
    data: {
      label: node.name,
      nodeType: getNodeType(node.type),
      icon: getNodeIcon(node.type),
      description: getNodeDescription(node.type),
    },
  }))

  const edges: Edge[] = []

  // Generate edges from connections
  if (workflowData.connections) {
    Object.entries(workflowData.connections).forEach(([sourceNodeName, connections]: [string, any]) => {
      if (connections.main) {
        connections.main[0]?.forEach((connection: any, index: number) => {
          const sourceNode = workflowData.nodes.find((n: any) => n.name === sourceNodeName)
          const targetNode = workflowData.nodes.find((n: any) => n.name === connection.node)

          if (sourceNode && targetNode) {
            edges.push({
              id: `${sourceNode.id}-${targetNode.id}-${index}`,
              source: sourceNode.id,
              target: targetNode.id,
              type: "smoothstep",
            })
          }
        })
      }
    })
  }

  return { nodes, edges }
}

function getNodeType(nodeType: string): "trigger" | "action" | "logic" {
  if (nodeType.includes("trigger") || nodeType.includes("webhook") || nodeType.includes("cron")) {
    return "trigger"
  }
  if (nodeType.includes("if") || nodeType.includes("switch") || nodeType.includes("merge")) {
    return "logic"
  }
  return "action"
}

function getNodeIcon(nodeType: string): string {
  const iconMap: Record<string, string> = {
    webhook: "globe",
    cron: "clock",
    openAi: "zap",
    googleCalendar: "calendar",
    whatsApp: "message-circle",
    instagram: "camera",
    facebook: "share-2",
    twitter: "twitter",
    linkedIn: "linkedin",
    shopify: "shopping-cart",
    stripe: "credit-card",
    if: "git-branch",
    emailSend: "mail",
  }

  const key = Object.keys(iconMap).find((k) => nodeType.includes(k))
  return iconMap[key || ""] || "zap"
}

function getNodeDescription(nodeType: string): string {
  const descMap: Record<string, string> = {
    webhook: "Receives HTTP requests",
    cron: "Scheduled trigger",
    openAi: "AI text generation",
    googleCalendar: "Calendar operations",
    whatsApp: "WhatsApp messaging",
    instagram: "Instagram integration",
    facebook: "Facebook posting",
    twitter: "Twitter operations",
    linkedIn: "LinkedIn posting",
    shopify: "E-commerce operations",
    stripe: "Payment processing",
    if: "Conditional logic",
    emailSend: "Send emails",
  }

  const key = Object.keys(descMap).find((k) => nodeType.includes(k))
  return descMap[key || ""] || "Workflow node"
}

export function WorkflowCanvas({ workflowId }: WorkflowCanvasProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateNodesAndEdges(workflowId), [workflowId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const nodeIndex = useRef(0)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<null | ReactFlowInstance<Node, Edge>>(null)

  // Handle node selection
  const onNodeClick = useCallback((_event: null | React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle pane click (deselect nodes)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Handle edge connection
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Check if source already has an edge
      const sourceHasEdge = edges.some(edge => edge.source === params.source)

      if (sourceHasEdge) {
        // Remove existing edge from this source
        setEdges(edges => edges.filter(edge => edge.source !== params.source))
      }

      setEdges(eds => addEdge(params, eds))
    },
    [edges, setEdges]
  )

  // Handle edge double click (deletion)
  const onEdgeDoubleClick: EdgeMouseHandler = useCallback(
    (_event, e) => {
      setEdges(eds => eds.filter(_e => _e.id !== e.id))
    },
    [setEdges]
  )

  // Handle drag over
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  // Handle drop
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = e.dataTransfer.getData('application/reactflow')

      if (type === undefined || !type || !reactFlowBounds) {
        return
      }

      const position = reactFlowInstance?.flowToScreenPosition({
        y: e.clientY - reactFlowBounds.top,
        x: e.clientX - reactFlowBounds.left
      })

      if (!position) {
        toast.error('Invalid position')
        return
      }

      const newNode: Node = {
        type,
        position,
        data: { text: '' },
        id: `${nodeIndex.current + 1}`
      }
      nodeIndex.current += 1

      setNodes(nds => [...nds, ...(Array.isArray(newNode) ? newNode : [newNode])])
    },
    [reactFlowInstance, nodeIndex, setNodes]
  )

  // Handle text change for selected node
  const onTextChange = useCallback(
    (text: string) => {
      if (selectedNode) {
        setNodes(nds =>
          nds.map(node => (node.id === selectedNode.id ? { ...node, data: { ...node.data, text } } : node))
        )
        setSelectedNode(prev => (prev ? { ...prev, data: { ...prev.data, text } } : null))
      }
    },
    [selectedNode, setNodes]
  )

  // Handle node change and update selected node to newly added node
  const _onNodesChange = useCallback(
    (node: NodeChange<Node>[]) => {
      onNodesChange(node)

      if (node[0]?.type === 'dimensions') {
        const addedNodeId = node[0]?.id
        if (addedNodeId) {
          const addedNode = nodes.find(n => n.id === addedNodeId)
          if (addedNode) setSelectedNode(addedNode)
        }
      }
    },
    [onNodesChange, nodes]
  )

  return (

    <div className="h-96 w-full border border-border rounded-lg overflow-hidden bg-background" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={_onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        // onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }} // Hide React Flow logo
        colorMode="light"
        autoSave="chatbot-flow"
        attributionPosition="bottom-left"
        className="bg-background"
      >
        <Controls className="bg-card border-border" />
        <MiniMap className="bg-card border-border" nodeColor="#8b5cf6" maskColor="rgba(0, 0, 0, 0.1)" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
      </ReactFlow>
    </div>
  )
}
