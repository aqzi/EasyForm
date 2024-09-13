import React, { useState, useRef, useEffect } from 'react';
import { Menu, List, Settings, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useFormEditorStore from '@/store/formEditor';
import Link from 'next/link'


export type DropdownOption = 'myForms' | 'createForm' | 'settings';

interface FormOptionsDropdownProps {
    options: DropdownOption[];
}

const FormOptionsDropdown: React.FC<FormOptionsDropdownProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const session = useSession();

    const { resetForm } = useFormEditorStore((state) => ({
        resetForm: state.resetForm,
    }));

    const buttonConfig = {
        myForms: { icon: List, text: 'My Forms', href: `/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms` },
        createForm: { icon: FileText, text: 'Create Form', href: `/createForm`},
        settings: { icon: Settings, text: 'Settings', href: `/${session?.data?.user?.name?.replace(/\s+/g, "")}/settings` },
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
                className={`absolute right-0 w-56 rounded-lg shadow-lg bg-gray-800 ring-1 ring-gray-700 transition-all duration-200 ease-in-out ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {options.map((option) => {
                        const { icon: Icon, text, href } = buttonConfig[option];
                        return (
                            <Link
                                key={option}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-150"
                                role="menuitem"
                                href={href}
                                onClick={() => (text === 'Create Form' && resetForm())}
                                prefetch={true}
                            >
                                <Icon size={18} className="mr-3 text-gray-400" />
                                <span className="font-medium">{text}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FormOptionsDropdown;