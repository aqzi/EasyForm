import React, { useState } from 'react';
import { Menu, Save, List, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type DropdownOption = 'save' | 'myForms' | 'createForm' | 'statistics';

interface FormOptionsDropdownProps {
    options: DropdownOption[];
    onSave: () => void;
}

const FormOptionsDropdown: React.FC<FormOptionsDropdownProps> = ({ options, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const session = useSession();

    const buttonConfig = {
        save: { icon: Save, text: 'Save', onClick: () => { onSave(); setIsOpen(false); } },
        myForms: { icon: List, text: 'My Forms', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`) },
        createForm: { icon: List, text: 'Create Form', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/createForm`) },
        statistics: { icon: BarChart2, text: 'Statistics', onClick: () => router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/statistics`) },
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2"
                title="More options"
            >
                <Menu size={30} className='text-[#8f9bd4]'/>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
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
            )}
        </div>
    );
};

export default FormOptionsDropdown;