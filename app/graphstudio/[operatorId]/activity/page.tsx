"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SidebarNav from "@/components/sidebar-nav"

interface ActivityPageProps {
  params: {
    operatorId: string
  }
}

export default function ActivityPage({ params }: ActivityPageProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      <SidebarNav operatorId={params.operatorId} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity & Audit</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track all graph and data entry activities</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-slate-700">
                <TabsTrigger value="history">Graph History</TabsTrigger>
                <TabsTrigger value="data-entry">Data Entry Log</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Graph Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Goal</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">oriel123</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Sales Q4</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">10-JAN-2025</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Forecast revenue</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">oriel123</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Customer Feedback</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">05-JAN-2025</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Collect feedback data</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                            In Progress
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="data-entry" className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Node Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Graph</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Entered At</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">john_op</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                            dataEntry
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Sales Q4</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">20-JAN-2025 14:30</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">Entered sales figures</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
