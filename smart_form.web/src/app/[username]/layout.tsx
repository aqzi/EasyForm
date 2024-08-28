import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1">
        <SessionProvider session={session}>
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </SessionProvider>
      </div>
    </div>
  )
}