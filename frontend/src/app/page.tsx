import { Button } from "@/components/atoms/button"
import { SearchInput } from "@/components/atoms/search-input"
import { Header } from "@/components/organisms/header"
import { ArrowRight, Download, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-work-sans font-bold text-foreground mb-6">Discover & Share n8n Workflows</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse, download and share the best n8n workflows. Automate your business processes with our
            community-driven workflow library.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchInput placeholder="Search workflows, nodes, or categories..." className="w-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse Workflows
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-work-sans font-bold text-foreground">500+</h3>
              <p className="text-muted-foreground">Workflows Available</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-work-sans font-bold text-foreground">10K+</h3>
              <p className="text-muted-foreground">Community Members</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Download className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-work-sans font-bold text-foreground">50K+</h3>
              <p className="text-muted-foreground">Downloads</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
