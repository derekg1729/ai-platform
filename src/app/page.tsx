import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ItemGrid from "@/components/ItemGrid"
import { NavBar } from "@/components/NavBar"

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-20">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-20 h-20 bg-purple-500/20 rounded-lg blur-xl floating" />
          <div className="absolute top-40 right-40 w-32 h-32 bg-blue-500/20 rounded-lg blur-xl floating-delayed" />
          <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-green-500/20 rounded-lg blur-xl floating-delayed-more" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Deploy AI agents,
              <br />
              anywhere.
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              The largest AI agent marketplace. Deploy and manage agents
              <br />
              on any platform with standardized APIs.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search for AI agents and tools"
                className="w-full h-12 bg-gray-900/50 border border-gray-700/50 text-white pl-4 pr-12 rounded-xl backdrop-blur-sm"
              />
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Agent Grid */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">Recently Added Agents</h2>
              <a href="#" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                View All Agents
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
              </a>
            </div>
            <ItemGrid />
          </div>
        </div>
      </main>
    </>
  )
}
