import { Badge } from "@/components/atoms/badge"

interface DifficultyBadgeProps {
  level: "Beginner" | "Intermediate" | "Advanced"
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const variants = {
    Beginner: "bg-green-100 text-green-800 hover:bg-green-100",
    Intermediate: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Advanced: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge variant="secondary" className={variants[level]}>
      {level}
    </Badge>
  )
}
