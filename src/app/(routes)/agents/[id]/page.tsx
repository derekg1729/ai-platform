import AgentDetails from '@/components/AgentDetails'

interface PageProps {
  params: { id: string }
}

export default function AgentDetailsPage({ params }: PageProps) {
  return <AgentDetails agentId={params.id} />
} 