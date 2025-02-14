import { Button } from "@/components/ui/button"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: string
  author: string
  rating: number
  reviews: number
  category: string
}

const dummyMarketplace: MarketplaceItem[] = [
  {
    id: "ra-premium",
    name: "Research Assistant Pro",
    description: "Advanced research agent with academic database integration and citation management.",
    price: "$29/mo",
    author: "AI Labs Inc.",
    rating: 4.8,
    reviews: 128,
    category: "Research"
  },
  {
    id: "code-copilot",
    name: "Code Copilot Enterprise",
    description: "AI-powered coding assistant with multi-language support and code review capabilities.",
    price: "$49/mo",
    author: "DevAI Solutions",
    rating: 4.9,
    reviews: 256,
    category: "Development"
  }
]

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            Marketplace
          </h1>
          <Button className="bg-purple-500 hover:bg-purple-600">
            Submit Agent
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["All", "Research", "Analysis", "Development", "Content", "Automation"].map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Marketplace Grid */}
        <div className="grid gap-6">
          {dummyMarketplace.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-400">{item.price}</span>
                    <span className="text-gray-400">by {item.author}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">{item.rating}</span>
                      <span className="text-gray-400">({item.reviews})</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Deploy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 