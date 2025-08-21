export interface Workflow {
  id: string
  title: string
  description: string
  author: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  category: string
  views: number
  downloads: number
  nodes: string[]
  createdAt: string
  updatedAt: string
  workflowData?: any // n8n workflow JSON data
}

export interface WorkflowFilters {
  categories: string[]
  difficulties: string[]
  nodes: string[]
  searchQuery: string
}