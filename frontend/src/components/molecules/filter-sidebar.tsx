import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import { Checkbox } from "@/components/atoms/checkbox"
import { Label } from "@/components/atoms/label"

interface FilterSidebarProps {
  selectedCategories: string[]
  selectedDifficulties: string[]
  selectedNodes: string[]
  onCategoryChange: (categories: string[]) => void
  onDifficultyChange: (difficulties: string[]) => void
  onNodeChange: (nodes: string[]) => void
}

const categories = [
  "IT & DevOps",
  "Sales & CRM",
  "AI & Machine Learning",
  "Marketing & Content",
  "Personal & Home Automation",
  "Productivity & Collaboration",
  "Customer Support & Helpdesk",
]

const difficulties = ["Beginner", "Intermediate", "Advanced"]

const popularNodes = [
  "Affinity",
  "JotForm Trigger",
  "PostBin",
  "DebugHelper",
  "SecurityScorecard",
  "Facebook Graph API",
  "Keap",
]

export function FilterSidebar({
  selectedCategories,
  selectedDifficulties,
  selectedNodes,
  onCategoryChange,
  onDifficultyChange,
  onNodeChange,
}: FilterSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    onCategoryChange(updated)
  }

  const handleDifficultyToggle = (difficulty: string) => {
    const updated = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : [...selectedDifficulties, difficulty]
    onDifficultyChange(updated)
  }

  const handleNodeToggle = (node: string) => {
    const updated = selectedNodes.includes(node) ? selectedNodes.filter((n) => n !== node) : [...selectedNodes, node]
    onNodeChange(updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">Difficulty Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {difficulties.map((difficulty) => (
            <div key={difficulty} className="flex items-center space-x-2">
              <Checkbox
                id={`difficulty-${difficulty}`}
                checked={selectedDifficulties.includes(difficulty)}
                onCheckedChange={() => handleDifficultyToggle(difficulty)}
              />
              <Label htmlFor={`difficulty-${difficulty}`} className="text-sm font-normal cursor-pointer">
                {difficulty}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-work-sans">Popular Nodes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularNodes.map((node) => (
            <div key={node} className="flex items-center space-x-2">
              <Checkbox
                id={`node-${node}`}
                checked={selectedNodes.includes(node)}
                onCheckedChange={() => handleNodeToggle(node)}
              />
              <Label htmlFor={`node-${node}`} className="text-sm font-normal cursor-pointer">
                {node}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
