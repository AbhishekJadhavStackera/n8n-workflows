import { WorkflowDescription } from "@/components/molecules/workflow-description"
import { WorkflowFeatures } from "@/components/molecules/workflow-features"
import { WorkflowSetupGuide } from "@/components/molecules/workflow-setup-guide"
import { Header } from "@/components/organisms/header"
import { WorkflowDetailHeader } from "@/components/organisms/workflow-detail-header"
import { WorkflowEditor } from "@/components/organisms/workflow-editor"
import { sampleWorkflows } from "@/lib/sample-data"
import { notFound } from "next/navigation"

interface WorkflowPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params
  const workflow = sampleWorkflows.find((w) => w.id === id)

  if (!workflow) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <WorkflowDetailHeader workflow={workflow} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <WorkflowDescription workflow={workflow} />
            <WorkflowFeatures workflow={workflow} />
            <WorkflowEditor workflowId={workflow.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WorkflowSetupGuide workflow={workflow} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return sampleWorkflows.map((workflow) => ({
    id: workflow.id,
  }))
}
