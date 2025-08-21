"use client"

import { Button } from "@/components/atoms/button"
import { SearchInput } from "@/components/atoms/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { FilterSidebar } from "@/components/molecules/filter-sidebar"
import { WorkflowCard } from "@/components/molecules/workflow-card"
import { Header } from "@/components/organisms/header"
import { sampleWorkflows } from "@/lib/sample-data"
import type { WorkflowFilters } from "@/lib/types"
import { Filter, Grid, List } from "lucide-react"
import { useMemo, useState } from "react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<WorkflowFilters>({
    categories: [],
    difficulties: [],
    nodes: [],
    searchQuery: "",
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Filter and search workflows
  const filteredWorkflows = useMemo(() => {
    let filtered = sampleWorkflows

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          workflow.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((workflow) => filters.categories.includes(workflow.category))
    }

    // Apply difficulty filters
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((workflow) => filters.difficulties.includes(workflow.difficulty))
    }

    // Apply node filters
    if (filters.nodes.length > 0) {
      filtered = filtered.filter((workflow) => filters.nodes.some((node) => workflow.nodes.includes(node)))
    }

    // Apply sorting
    switch (sortBy) {
      case "views":
        filtered.sort((a, b) => b.views - a.views)
        break
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      default:
        // relevance - keep original order
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-work-sans font-bold text-foreground mb-4">Discover Workflows</h1>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search workflows, nodes, or categories..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-80 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FilterSidebar
              selectedCategories={filters.categories}
              selectedDifficulties={filters.difficulties}
              selectedNodes={filters.nodes}
              onCategoryChange={(categories) => setFilters({ ...filters, categories })}
              onDifficultyChange={(difficulties) => setFilters({ ...filters, difficulties })}
              onNodeChange={(nodes) => setFilters({ ...filters, nodes })}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{filteredWorkflows.length} workflows found</span>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="downloads">Most Downloads</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Workflow Grid */}
            {filteredWorkflows.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredWorkflows.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    id={workflow.id}
                    title={workflow.title}
                    description={workflow.description}
                    author={workflow.author}
                    difficulty={workflow.difficulty}
                    tags={workflow.tags}
                    views={workflow.views}
                    downloads={workflow.downloads}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No workflows found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
