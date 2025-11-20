"use client"

import { BarChart3, History, Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  operatorId: string
}

export default function SidebarNav({ operatorId }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems = [
    { icon: BarChart3, label: "Graphs", href: `/graphstudio/${operatorId}/graphs` },
    { icon: History, label: "Activity", href: `/graphstudio/${operatorId}/activity` },
    { icon: Settings, label: "Settings", href: `/graphstudio/${operatorId}/settings` },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GraphStudio</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Operator Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.includes(item.href.split("/").pop() || "")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm group",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">Operator ID: {operatorId}</p>
      </div>
    </aside>
  )
}
