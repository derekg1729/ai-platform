import AgentDetails from '@/components/AgentDetails'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AgentDetailsPage({ params }: PageProps) {
  const { id } = await params
  return <AgentDetails agentId={id} />
} 