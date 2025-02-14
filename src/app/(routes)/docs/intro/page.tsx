import { getMarkdownContent } from '@/lib/mdx'

export default async function IntroPage() {
  const content = await getMarkdownContent('src/content/shared/platform-docs.mdx')

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto prose prose-invert prose-purple">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
} 