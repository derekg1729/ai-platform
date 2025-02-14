import { Button } from "@/components/ui/button"

interface AgentInstance {
  id: string
  name: string
  status: "active" | "inactive"
  type: string
  lastActive: string
  apiKey?: string
  connections: string[]
}

const dummyInstances: AgentInstance[] = [
  {
    id: "ra-1",
    name: "Research Assistant",
    status: "active",
    type: "Research",
    lastActive: "2 minutes ago",
    apiKey: "sk-...f3k2",
    connections: ["Notion", "Google Drive"]
  },
  {
    id: "da-1",
    name: "Data Analyzer",
    status: "inactive",
    type: "Analysis",
    lastActive: "2 days ago",
    connections: ["Tableau", "Excel"]
  }
]

export default function MyAgentsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            My Agents
          </h1>
          <Button className="bg-purple-500 hover:bg-purple-600">
            Deploy New Agent
          </Button>
        </div>

        <div className="grid gap-6">
          {dummyInstances.map((instance) => (
            <div 
              key={instance.id}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {instance.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className={`w-2 h-2 rounded-full ${
                      instance.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    {instance.status === 'active' ? 'Active' : 'Inactive'}
                    <span className="mx-2">•</span>
                    Last active {instance.lastActive}
                  </div>
                </div>
                <Button variant="outline" className="border-purple-500/50 text-purple-400">
                  Manage
                </Button>
              </div>

              <div className="mt-4 grid gap-4">
                {instance.apiKey && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">API Key</div>
                    <code className="text-sm text-purple-400">{instance.apiKey}</code>
                  </div>
                )}
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Connected Services</div>
                  <div className="flex gap-2">
                    {instance.connections.map((service) => (
                      <span 
                        key={service}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 