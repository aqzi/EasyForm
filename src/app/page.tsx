import React from 'react'
import Link from 'next/link'
import LoginBtn from '@/components/auth/loginBtn'
import { cookies } from 'next/headers'
import ThemeToggle from '@/components/layout/themeToggle'

export default async function Home() {
    // const cookieStore = cookies()
    // const isDarkMode = cookieStore.get('darkMode')?.value === 'true'

    const isDarkMode = true

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-12">
                <nav className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">EasyForm</h1>
                    <div className="flex items-center space-x-4">
                        <LoginBtn isDarkMode={isDarkMode} />
                    </div>
                </nav>

                <div className="text-center mb-16 mt-32 items-center flex flex-col justify-center">
                    <h2 className="xl:text-5xl text-4xl font-bold mb-6">Open Source Form Creator and Manager</h2>
                    <p className="xl:text-2xl text-xl mb-16">simple, secure and customizable</p>
                    <Link
                        href="/createForm"
                        prefetch={true}
                        className="bg-[#222222] text-white border border-[#34d399] px-5 py-2 rounded-md xl:text-xl text-lg font-bold hover:bg-[#292929] transition-colors inline-block"
                    >
                        Get started
                    </Link>
                    <img className='mt-24 mb-40 mx-20 border rounded-lg border-gray-700 lg:w-3/4 xl:w-2/4 w-full drop-shadow-[8px_8px_15px_rgba(0,100,255,0.5)]' src="/demoView.png" alt="" />
                </div>
            </div>
        </main>
    )
}