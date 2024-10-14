"use client"

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react'
import Skeleton from '@/components/layout/skeleton';
import { useRouter } from 'next/navigation';
import Profile from '@/components/settings/items/profile';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const router = useRouter();
    const session = useSession();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }

    return (
        <Skeleton options={['createForm', 'myForms']}>
            <div className='w-full max-w-5xl sm:w-4/5 xl:w-3/5 mt-8 h-full'>
                <div className="relative mb-12">
                    <h1 className="text-4xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 px-2 py-4 rounded">
                        Settings
                    </h1>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-6 w-full">
                        <Profile 
                            activeSection={activeSection} 
                            username={session?.data?.user?.name}
                            email={session?.data?.user?.email}
                            setActiveSection={setActiveSection}
                            signout={(callbackUrl) => signOut({ callbackUrl })}
                        />
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400 italic">
                    More settings coming soon
                </div>
            </div>
        </Skeleton>
    );
};

export default SettingsPage;
