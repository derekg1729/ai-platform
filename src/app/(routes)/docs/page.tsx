'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Introduction from '@/content/docs/index.mdx'
import CoreConcepts from '@/content/docs/core-concepts/index.mdx'
import ApiReference from '@/content/docs/api-reference/index.mdx'
import Testing from '@/content/docs/core-concepts/testing.mdx'

/**
 * DUMMY DATA: Documentation sections and items
 * TODO: Replace with real documentation data from a CMS or MDX files
 * Required implementations:
 * 1. Documentation content management
 * 2. Search functionality
 * 3. Version control
 * 4. Interactive examples
 */

interface DocSection {
  id: string
  title: string
  content: React.ComponentType
}

const sections: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: Introduction
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    content: CoreConcepts
  },
  {
    id: "api-reference",
    title: "API Reference",
    content: ApiReference
  },
  {
    id: "testing",
    title: "Testing",
    content: Testing
  }
]

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-8">
          Documentation
        </h1>

        <Tabs defaultValue="introduction" className="space-y-8">
          <TabsList className="bg-gray-900/50 border border-gray-700/50 h-12">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white px-6"
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => {
            const Content = section.content
            return (
              <TabsContent key={section.id} value={section.id}>
                <div className="prose prose-invert prose-purple max-w-none">
                  <Content />
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
} 