import SideBar from '@/components/layout/sideBar'
import TopBar from '@/components/layout/topBar'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <SessionProvider session={session}>
          <TopBar />
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </SessionProvider>
      </div>
    </div>
  )
}