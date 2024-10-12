import React from 'react';
import { auth } from '@/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const LoginBtn = async (props: { isDarkMode: boolean }) => {
    const session = await auth()

    if (session?.user) {
        return (
            <Link 
                href={`/${session.user?.name?.replace(/\s+/g, "")}`}
                className={`${props.isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-4 py-2 rounded-md font-semibold hover:opacity-90 transition-colors flex items-center`}
            >
                Workspace {'->'}
            </Link>
        )
    }

    return (
        <Link 
            href="/register"
            className={`${props.isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center`}
        >
            <LogIn className="mr-2 h-5 w-5" /> Login
        </Link>
    )
};

export default LoginBtn;
