import React from 'react';
import { signIn, auth } from '@/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const generateRandomUsername = (length: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

const LoginForm = async (props: { isDarkMode: boolean }) => {
    const session = await auth()

    if (session) {
        return (
            <Link 
                href={`/${session.user?.name?.replace(/\s+/g, "")}`}
                className={`${props.isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center`}
            >
                Go to App {'->'}
            </Link>
        )
    }

    return (
        <form action={async () => {
            "use server"
            const uri = `/${generateRandomUsername(15)}`
            await signIn('google', { redirectTo: uri })
        }}>
            <button 
                type='submit' 
                className={`${props.isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center`}
            >
                <LogIn className="mr-2 h-5 w-5" /> Login
            </button>
        </form>
    );
};

export default LoginForm;
