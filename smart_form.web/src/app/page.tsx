import React from 'react'
import Link from 'next/link'
import { Zap, Smile, Sliders } from 'lucide-react'
import LoginBtn from '@/components/auth/loginBtn'
import { cookies } from 'next/headers'
import ThemeToggle from '@/components/layout/themeToggle'
import { auth } from '@/auth'

export default async function Home() {
  const cookieStore = cookies()
  const isDarkMode = cookieStore.get('darkMode')?.value === 'true'
  const session = await auth()

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">EasyForm</h1>
          <div className="flex items-center space-x-4">
            {/* <ThemeToggle isDarkMode={isDarkMode} /> */}
            <LoginBtn isDarkMode={isDarkMode} />
          </div>
        </nav>

        <div className="text-center mb-16 mt-32">
          <h2 className="text-5xl font-bold mb-6">Create Intelligent Forms with Ease</h2>
          <p className="text-xl mb-16">EasyForm revolutionizes the way you collect and analyze data.</p>
          <Link
            href="/createForm"
            prefetch={true}
            className="bg-[#34d349] text-gray-900 px-5 py-2 rounded-md text-xl font-bold hover:bg-[#2cb33e] transition-colors inline-block"
          >
            Get started
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-40">
          {[
            { icon: Zap, title: 'AI-Powered', description: 'Leverage machine learning for smarter form creation and analysis.' },
            { icon: Smile, title: 'User-Friendly', description: 'Intuitive interface for effortless form design and management.' },
            { icon: Sliders, title: 'Customizable', description: 'Tailor forms to your specific needs with advanced customization options.' },
          ].map((feature, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-[#1a1a1a] border-[#fff]' : 'bg-white border-[#000]'} p-6 rounded-lg shadow-lg border border-opacity-10`}>
              <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className='text-[#959595]'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}