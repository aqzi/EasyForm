import FormOptionsDropdown from '@/components/layout/dropdown';
import { DropdownOption } from '@/components/layout/dropdown';
import Link from 'next/link';

interface SkeletonProps {
    options: DropdownOption[];
    children: React.ReactNode;
}

//This defines the layout of the platform
const Skeleton: React.FC<SkeletonProps> = ({ options, children }) => {
    return (
        <div className="flex relative justify-center h-full w-full bg-[#1e1e1e] p-4 overflow-hidden">
            {options.length > 0 && (
                <div className="absolute top-6 right-6">
                    <FormOptionsDropdown options={options}/>
                </div>
            )}
            <Link 
                href="/"
                className="absolute top-6 left-6"
            >
                <h1 className='bg-clip-text text-[#f6f6f6] text-4xl font-bold tracking-tight'>
                    EasyForm
                </h1>
            </Link>
            <div className='md:p-20 py-20 w-full items-center flex justify-center'>
                {children}
            </div>
        </div>
    )
}

export default Skeleton;