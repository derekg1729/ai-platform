import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
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

        {/* Forgot Password Form */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Reset password</h2>
          <p className="text-gray-400 mb-6">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
          
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

            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 h-auto">
              Send reset instructions
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 