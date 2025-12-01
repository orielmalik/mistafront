// app/page.tsx
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-black dark:to-slate-900 flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            GraphStudio Pro
          </span>
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6">
            Build Smart
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Knowledge Graphs
          </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Create AI-powered interviews, personality tests, and dynamic questionnaires – all connected in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth">
              <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all hover:scale-105">
              <span className="flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              </button>
            </Link>

            <Link href="/graphstudio/demo/graphs/demo-graph/studio">
              <button className="px-10 py-5 bg-white dark:bg-slate-800 text-gray-800 dark:text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-gray-200 dark:border-slate-700">
                Try Demo →
              </button>
            </Link>
          </div>

          <p className="mt-16 text-sm text-gray-500 dark:text-gray-400">
            No login required for demo • Full studio access
          </p>
        </div>
      </div>
  )
}