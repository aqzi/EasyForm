import React from 'react';
import { Home, PlusSquare, List, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const SideBar: React.FC = async () => {
  const session = await auth()

  if (!session) redirect('/')

  const baseUri = `/${session?.user?.name?.replace(/\s+/g, "")}`

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: baseUri },
    { icon: <PlusSquare size={20} />, label: 'Create Form', href: `${baseUri}/createForm` },
    { icon: <List size={20} />, label: 'My Forms', href: `${baseUri}/myForms` },
    { icon: <Users size={20} />, label: 'Responses', href: `${baseUri}/responses` },
  ];

  return (
    <div className="h-screen w-64 bg-[#16161d] text-gray-300 flex flex-col border-r border-[#8f9bd4]">
      <div className="p-4 text-2xl font-bold">SmartForm</div>
      <hr className="border-[#8f9bd4] mx-4" />
      <nav className="flex-grow mt-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors"
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <Link href={`${baseUri}/settings`} className="flex items-center hover:text-gray-100 transition-colors">
          <Settings size={20} className="mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default SideBar;