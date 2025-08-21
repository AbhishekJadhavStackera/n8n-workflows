import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { DifficultyBadge } from "@/components/atoms/difficulty-badge"
import { Download, Eye } from "lucide-react"
import Link from "next/link"

interface WorkflowCardProps {
  id: string
  title: string
  description: string
  author: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  views: number
  downloads: number
}

export function WorkflowCard({
  id,
  title,
  description,
  author,
  difficulty,
  tags,
  views,
  downloads,
}: WorkflowCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-work-sans font-semibold text-card-foreground line-clamp-2">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">by {author}</CardDescription>
          </div>
          <DifficultyBadge level={difficulty} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{downloads}</span>
            </div>
          </div>

          <Link href={`/workflows/${id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View Workflow
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
