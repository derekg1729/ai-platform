import ModelDetails from '@/components/ModelDetails'

interface PageProps {
  params: { id: string }
}

export default function ModelDetailsPage({ params }: PageProps) {
  return <ModelDetails modelId={params.id} />
} 