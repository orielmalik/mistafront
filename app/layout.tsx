// app/layout.tsx
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" dir="ltr">
      <body className="min-h-screen bg-gray-50 dark:bg-black">
      <AuthProvider>
        {children}
      </AuthProvider>
      </body>
      </html>
  )
}