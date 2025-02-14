import { getMarkdownContent } from '@/lib/mdx'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string[] }
}

export default async function DocsPage({ params }: PageProps) {
  // Handle both section and subsection paths
  const path = `src/content/docs/${params.slug.join('/')}`
  const indexPath = `${path}/index.mdx`
  const directPath = `${path}.mdx`

  try {
    // Try loading as index file first, then as direct file
    let content = await getMarkdownContent(indexPath)
    if (!content) {
      content = await getMarkdownContent(directPath)
    }

    if (!content) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-purple">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    )
  } catch {
    return notFound()
  }
} 