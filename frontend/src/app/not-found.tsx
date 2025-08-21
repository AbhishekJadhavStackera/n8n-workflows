import { Button } from "@/components/atoms/button"
import { Header } from "@/components/organisms/header"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <h1 className="text-6xl font-work-sans font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-work-sans font-semibold text-foreground">Workflow Not Found</h2>
            <p className="text-muted-foreground">The workflow you're looking for doesn't exist or has been removed.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse Workflows</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
