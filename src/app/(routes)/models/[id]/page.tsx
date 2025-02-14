import ModelDetails from '@/components/ModelDetails'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModelDetailsPage({ params }: PageProps) {
  const { id } = await params
  return <ModelDetails modelId={id} />
} 