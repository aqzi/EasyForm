'use client'

import React, { useState } from 'react';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react'

const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const session = useSession()

  const notifications = [
    { id: 1, message: 'New form submission received' },
    { id: 2, message: 'Your form "Customer Survey" is trending' },
    { id: 3, message: 'Reminder: Review weekly statistics' },
  ];

  return (
    <div className="bg-[#16161d] border-b border-[#8f9bd4] p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <Bell size={20} />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
              {notifications.map((notif) => (
                <div key={notif.id} className="px-4 py-2 hover:bg-gray-700 text-sm text-gray-300">
                  {notif.message}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-2 rounded-md"
          >
            <User size={20} />
            <span className="text-sm font-medium">{session?.data?.user?.name}</span>
            <ChevronDown size={16} />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
              <div className="px-4 py-2 text-sm text-gray-300">
                {session?.data?.user?.email}
              </div>
              <div className="px-4 py-2 text-sm text-gray-300">
                ID: {session?.data?.user?.id}
              </div>
              <hr className="border-gray-700" />
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;