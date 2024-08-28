import FormOptionsDropdown from '@/components/layout/dropdown';
import React from 'react';
import { DropdownOption } from '@/components/layout/dropdown';

interface SkeletonProps {
    options: DropdownOption[];
    children: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ options, children }) => {
    return (
        <div className="flex relative justify-center h-full bg-[#151515] p-4 shadow-lg overflow-hidden">
            <div className="absolute top-6 right-6">
                <FormOptionsDropdown options={options}/>
            </div>
            <div className="absolute top-6 left-6">
                <h1 className='text-[#e5e5e5] text-3xl font-bold'>EasyForm</h1>
            </div>
            <div className='h-full mt-20'>
                {children}
            </div>
        </div>
    )
}

export default Skeleton;