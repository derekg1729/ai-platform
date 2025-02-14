export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Total Agents</div>
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-sm text-green-400 mt-2">↑ 2 this month</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">API Calls</div>
            <div className="text-3xl font-bold text-white">8,392</div>
            <div className="text-sm text-green-400 mt-2">↑ 12% from last week</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Avg Response Time</div>
            <div className="text-3xl font-bold text-white">1.2s</div>
            <div className="text-sm text-red-400 mt-2">↓ 0.3s from last week</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">API Usage Over Time</h3>
            <div className="aspect-[16/9] bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400">
              Chart Placeholder
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Agent Performance</h3>
            <div className="aspect-[16/9] bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 