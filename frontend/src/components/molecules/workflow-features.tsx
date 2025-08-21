import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import type { Workflow } from "@/lib/types"
import { CheckCircle } from "lucide-react"

interface WorkflowFeaturesProps {
  workflow: Workflow
}

// Generate features based on workflow data
function generateFeatures(workflow: Workflow): string[] {
  const features = []

  if (workflow.tags.includes("AI") || workflow.tags.includes("GPT-4o")) {
    features.push("AI-powered automation with advanced language processing")
  }

  if (workflow.tags.includes("WhatsApp") || workflow.tags.includes("Instagram") || workflow.tags.includes("Facebook")) {
    features.push("Multi-platform social media integration")
  }

  if (workflow.tags.includes("Google Calendar")) {
    features.push("Smart calendar management and scheduling")
  }

  if (workflow.difficulty === "Advanced") {
    features.push("Complex workflow logic with multiple decision points")
  }

  if (workflow.tags.includes("Customer Service") || workflow.tags.includes("Customer Support")) {
    features.push("Automated customer interaction handling")
  }

  if (workflow.tags.includes("OCR") || workflow.tags.includes("PDF")) {
    features.push("Document processing and data extraction")
  }

  if (workflow.tags.includes("CRM") || workflow.tags.includes("Sales")) {
    features.push("CRM integration and lead management")
  }

  // Default features if none match
  if (features.length === 0) {
    features.push("Streamlined automation workflow")
    features.push("Easy to customize and extend")
    features.push("Reliable error handling and monitoring")
  }

  // Always add these common features
  features.push("Step-by-step setup instructions")
  features.push("Compatible with n8n cloud and self-hosted")

  return features
}

export function WorkflowFeatures({ workflow }: WorkflowFeaturesProps) {
  const features = generateFeatures(workflow)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-work-sans">What this workflow does</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
