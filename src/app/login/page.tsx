import { login, signup } from './actions'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-zinc-400">Sign in to your Marketing Agency dashboard</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button formAction={login} className="w-full">
                Log in
              </Button>
              <Button formAction={signup} variant="outline" className="w-full">
                Sign up
              </Button>
            </div>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Developer Tools</span></div>
            </div>

            <a href="/dashboard" className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all active:scale-95">
              Bypass Login (Dev Mode)
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
