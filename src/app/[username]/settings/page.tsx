"use client"

import React, { useState } from 'react';
import { User, Lock, Bell, LogOut } from 'lucide-react';
import SettingsCard from '@/components/settings/settingsCard';
import { useSession, signOut } from 'next-auth/react'
import { SubSettings, SubSettingItem } from '@/components/settings/subSettings';
import Skeleton from '@/components/layout/skeleton';
import { useRouter } from 'next/navigation';

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
                        <SettingsCard
                            icon={User}
                            title="Profile"
                            isActive={activeSection === 'profile'}
                            onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
                        >
                            <SubSettings isVisible={activeSection === 'profile'}>
                                <div className="space-y-4">
                                    <SubSettingItem title="Personal Information">
                                        <div className="space-y-2">
                                            <p className="text-gray-300">
                                                <span className="font-semibold">Name:</span> {session?.data?.user?.name || 'Not set'}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-semibold">Email:</span> {session?.data?.user?.email || 'Not set'}
                                            </p>
                                        </div>
                                    </SubSettingItem>
                                    {/* <SubSettingItem title="Preferences">
                                        <p>Customize your account preferences</p>
                                    </SubSettingItem> */}
                                    <div className="mt-6">
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#2c2c2c] border border-gray-400 rounded-md hover:bg-[#414141] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                        >
                                            <LogOut size={18} className="mr-2 text-white" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </SubSettings>
                        </SettingsCard>

                        {/* <SettingsCard
                        icon={Lock}
                        title="Security"
                        isActive={activeSection === 'security'}
                        onClick={() => setActiveSection(activeSection === 'security' ? null : 'security')}
                        >
                        <SubSettings isVisible={activeSection === 'security'}>
                            <SubSettingItem title="Password">
                            Change your password or enable two-factor authentication
                            </SubSettingItem>
                            <SubSettingItem title="Login History">
                            View your recent login activity
                            </SubSettingItem>
                        </SubSettings>
                        </SettingsCard>

                        <SettingsCard
                        icon={Bell}
                        title="Notifications"
                        isActive={activeSection === 'notifications'}
                        onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
                        >
                        <SubSettings isVisible={activeSection === 'notifications'}>
                            <SubSettingItem title="Email Notifications">
                            Choose which emails you'd like to receive
                            </SubSettingItem>
                            <SubSettingItem title="Push Notifications">
                            Configure notifications for your devices
                            </SubSettingItem>
                        </SubSettings>
                        </SettingsCard> */}
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
