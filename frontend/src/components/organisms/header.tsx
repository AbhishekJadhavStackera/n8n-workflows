import { Button } from "@/components/atoms/button"
import { Logo } from "@/components/atoms/logo"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Workflows
            </a>
            <a href="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Categories
            </a>
            <a href="/tutorials" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Tutorials
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button variant="outline" size="sm">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>
    </header>
  )
}
