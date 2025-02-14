'use client'

interface Agent {
  id: string
  name: string
  added: string
  performance: number
  uptime: number
  tasks: number
  efficiency: number
  icon: string
}

const dummyAgents: Agent[] = [
  {
    id: "ASSISTANT_I",
    name: "Research Assistant",
    added: "2 days ago",
    performance: 95.5,
    uptime: 99.8,
    tasks: 445,
    efficiency: 92.3,
    icon: "RA",
  },
  {
    id: "ANALYZER_II",
    name: "Data Analyzer",
    added: "2 days ago",
    performance: 88.8,
    uptime: 97.9,
    tasks: 286,
    efficiency: 89.2,
    icon: "DA",
  },
  {
    id: "CURATOR_III",
    name: "Content Curator",
    added: "2 days ago",
    performance: 91.3,
    uptime: 98.0,
    tasks: 122,
    efficiency: 94.3,
    icon: "CC",
  },
  {
    id: "CODE_BOT",
    name: "Code Assistant",
    added: "2 days ago",
    performance: 93.7,
    uptime: 99.6,
    tasks: 493,
    efficiency: 91.5,
    icon: "CA",
  },
  {
    id: "WRITER_AI",
    name: "Creative Writer",
    added: "2 days ago",
    performance: 87.3,
    uptime: 96.8,
    tasks: 215,
    efficiency: 88.9,
    icon: "CW",
  }
]

export default function ItemGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {dummyAgents.map((agent) => (
        <div
          key={agent.id}
          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-start space-x-4">
            <div 
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded text-black font-bold"
              style={{
                backgroundColor: 
                  agent.icon === 'RA' ? '#a78bfa' : // purple for Research Assistant
                  agent.icon === 'DA' ? '#60a5fa' : // blue for Data Analyzer
                  agent.icon === 'CC' ? '#34d399' : // green for Content Curator
                  agent.icon === 'CA' ? '#f87171' : // red for Code Assistant
                  agent.icon === 'CW' ? '#fbbf24' : // yellow for Creative Writer
                  '#9ca3af' // default gray
              }}
            >
              {agent.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <span className="text-xs text-gray-400">{agent.added}</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">⚡</span>
                  <span className="text-sm text-gray-300">{agent.performance}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">⏱</span>
                  <span className="text-sm text-gray-300">{agent.uptime}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">📊</span>
                  <span className="text-sm text-gray-300">{agent.tasks} tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 