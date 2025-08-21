import { Avatar, AvatarFallback } from "@/components/atoms/avatar"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { DifficultyBadge } from "@/components/atoms/difficulty-badge"
import type { Workflow } from "@/lib/types"
import { Download, Eye, Heart, Share2 } from "lucide-react"

interface WorkflowDetailHeaderProps {
  workflow: Workflow
}

export function WorkflowDetailHeader({ workflow }: WorkflowDetailHeaderProps) {
  const authorInitials = workflow.author
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/search" className="hover:text-foreground">
          Workflows
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{workflow.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-work-sans font-bold text-foreground mb-2">{workflow.title}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">by {workflow.author}</span>
              </div>
              <DifficultyBadge level={workflow.difficulty} />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {workflow.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{workflow.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>{workflow.downloads.toLocaleString()} downloads</span>
          </div>
          <div>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  )
}
