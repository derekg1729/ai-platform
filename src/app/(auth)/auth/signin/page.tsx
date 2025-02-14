import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignInPage() {
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

        {/* Sign In Form */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 h-auto">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Don't have an account?</span>
            {" "}
            <Link
              href="/auth/signup"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 