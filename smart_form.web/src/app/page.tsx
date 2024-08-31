import React from 'react'
import Link from 'next/link'
import { Zap, Smile, Sliders } from 'lucide-react'
import LoginForm from '@/components/auth/loginForm'
import { cookies } from 'next/headers'
import ThemeToggle from '@/components/layout/themeToggle'
import { auth } from '@/auth'

export default async function Home() {
  const cookieStore = cookies()
  const isDarkMode = cookieStore.get('darkMode')?.value === 'true'
  const session = await auth()

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Smart Form</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle isDarkMode={isDarkMode} />
            <LoginForm isDarkMode={isDarkMode} />
          </div>
        </nav>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Create Intelligent Forms with Ease</h2>
          <p className="text-xl mb-8">Smart Form revolutionizes the way you collect and analyze data.</p>
          { !session && (
            <div className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-xl font-bold hover:bg-yellow-300 transition-colors inline-block">
              Login to access beta - It's Free!
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Zap, title: 'AI-Powered', description: 'Leverage machine learning for smarter form creation and analysis.' },
            { icon: Smile, title: 'User-Friendly', description: 'Intuitive interface for effortless form design and management.' },
            { icon: Sliders, title: 'Customizable', description: 'Tailor forms to your specific needs with advanced customization options.' },
          ].map((feature, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}