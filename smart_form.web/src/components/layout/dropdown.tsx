import React, { useState, useRef, useEffect } from 'react';
import { Menu, Save, List, BarChart2, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export type DropdownOption = 'myForms' | 'createForm' | 'statistics' | 'settings';

interface FormOptionsDropdownProps {
    options: DropdownOption[];
}

const FormOptionsDropdown: React.FC<FormOptionsDropdownProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const session = useSession();

    const buttonConfig = {
        myForms: { icon: List, text: 'My Forms', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`) },
        createForm: { icon: List, text: 'Create Form', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/createForm`) },
        statistics: { icon: BarChart2, text: 'Statistics', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/statistics`) },
        settings: { icon: Settings, text: 'Settings', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/settings`) },
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div 
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2"
                title="More options"
            >
                <Menu size={60} strokeWidth={1} className='text-[#8f9bd4]'/>
            </button>
            <div 
                className={`absolute right-0 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {options.map((option) => {
                        const { icon: Icon, text, onClick } = buttonConfig[option];
                        return (
                            <button
                                key={option}
                                onClick={() => { onClick(); setIsOpen(false); }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                                role="menuitem"
                            >
                                <Icon size={16} className="mr-2" />
                                {text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FormOptionsDropdown;