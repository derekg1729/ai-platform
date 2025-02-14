import ItemGrid from "@/components/ItemGrid"

export default function BrowsePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          Browse AI Agents
        </h1>
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="flex gap-4">
            <select className="bg-gray-900/50 border border-gray-700/50 text-white rounded-xl px-4 py-2 flex-1">
              <option value="">All Categories</option>
              <option value="research">Research</option>
              <option value="analysis">Analysis</option>
              <option value="content">Content</option>
              <option value="coding">Coding</option>
            </select>
            <select className="bg-gray-900/50 border border-gray-700/50 text-white rounded-xl px-4 py-2 flex-1">
              <option value="">Sort By: Recent</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
            </select>
          </div>
        </div>
        <ItemGrid />
      </div>
    </div>
  )
} 