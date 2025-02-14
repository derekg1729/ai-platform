import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

export async function getMarkdownContent(filePath: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    // Parse frontmatter and content
    const { content } = matter(fileContents)

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content)

    return processedContent.toString()
  } catch (error) {
    console.error(`Error processing markdown content from ${filePath}:`, error)
    return null
  }
}

export async function getReadmeContent() {
  return getMarkdownContent('README.md')
} 