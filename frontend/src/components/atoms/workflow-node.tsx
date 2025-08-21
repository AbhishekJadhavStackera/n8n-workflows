"use client"

import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/atoms/card"
import { Handle, Position } from "@xyflow/react"
import {
  AlertCircle,
  Calendar,
  Camera,
  Check,
  Clock,
  CreditCard,
  GitBranch,
  Globe,
  Linkedin,
  Mail,
  MessageCircle,
  Play,
  Share2,
  ShoppingCart,
  Twitter,
  Zap,
} from "lucide-react"

interface WorkflowNodeProps {
  data: {
    label: string
    nodeType: "trigger" | "action" | "logic"
    icon: string
    description: string
  }
}

const iconMap = {
  play: Play,
  globe: Globe,
  "git-branch": GitBranch,
  check: Check,
  "alert-circle": AlertCircle,
  zap: Zap,
  clock: Clock,
  calendar: Calendar,
  "message-circle": MessageCircle,
  camera: Camera,
  "share-2": Share2,
  twitter: Twitter,
  linkedin: Linkedin,
  "shopping-cart": ShoppingCart,
  "credit-card": CreditCard,
  mail: Mail,
}

const nodeTypeColors = {
  trigger: "bg-green-100 text-green-800 border-green-200",
  action: "bg-blue-100 text-blue-800 border-blue-200",
  logic: "bg-purple-100 text-purple-800 border-purple-200",
}

export function WorkflowNode({ data }: WorkflowNodeProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || Zap

  return (
    <Card className={`min-w-40 p-3 shadow-md hover:shadow-lg transition-shadow ${nodeTypeColors[data.nodeType]}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />

      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <p className="text-xs opacity-75 mb-2">{data.description}</p>

      <Badge variant="outline" className="text-xs">
        {data.nodeType}
      </Badge>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </Card>
  )
}
