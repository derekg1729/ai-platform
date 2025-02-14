import Link from 'next/link'

const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/intro" },
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "Installation", href: "/docs/installation" },
    ]
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Agent Architecture", href: "/docs/architecture" },
      { title: "Authentication", href: "/docs/auth" },
      { title: "API Keys", href: "/docs/api-keys" },
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "REST API", href: "/docs/api/rest" },
      { title: "WebSocket API", href: "/docs/api/websocket" },
      { title: "Rate Limits", href: "/docs/api/limits" },
    ]
  }
]

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          Documentation
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          Learn how to integrate and deploy AI agents on our platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
                    >
                      {item.title}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-12 bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Reference
          </h2>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <code className="text-sm text-purple-400">
              curl -X POST https://api.aiagenthub.com/v1/agents/deploy \<br />
              &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;-d '{"agent_id": "research-assistant", "config": {}}'
            </code>
          </div>
        </div>
      </div>
    </div>
  )
} 