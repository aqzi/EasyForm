'use client'
import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ThemeToggle({ isDarkMode }: { isDarkMode: boolean }) {
    const router = useRouter()

    const toggleTheme = () => {
        document.cookie = `darkMode=${!isDarkMode}; path=/; max-age=31536000`
        router.refresh()
    }

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
    )
}