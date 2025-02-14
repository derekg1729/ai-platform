import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="text-white font-bold text-2xl flex items-center justify-center gap-3"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-lg">
              AI
            </div>
            <span>Agent Hub</span>
          </Link>
        </div>

        {/* Sign Up Form */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-gray-400 mb-6">Start deploying AI agents in minutes</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  First name
                </label>
                <Input
                  type="text"
                  className="w-full bg-gray-800/50 border-gray-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Last name
                </label>
                <Input
                  type="text"
                  className="w-full bg-gray-800/50 border-gray-700/50 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Work email
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="8+ characters"
                className="w-full bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 bg-gray-800 border-gray-700 rounded text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 h-auto">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Already have an account?</span>
            {" "}
            <Link
              href="/auth/signin"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 