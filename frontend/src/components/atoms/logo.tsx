import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">n8n</span>
      </div>
      <span className="font-work-sans font-bold text-xl text-foreground">Workflows</span>
    </Link>
  )
}
