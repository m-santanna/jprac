import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { JetBrains_Mono } from "next/font/google"
import "@/app/globals.css"
import { Providers } from "@/app/providers"

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: "jprac",
  description: "Practice japanese with friends in real-time",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body
        className="antialiased"
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
