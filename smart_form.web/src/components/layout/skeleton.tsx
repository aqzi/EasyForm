import { usePathname } from 'next/navigation';
import FormOptionsDropdown from '@/components/layout/dropdown';
import { DropdownOption } from '@/components/layout/dropdown';
import Link from 'next/link';

interface SkeletonProps {
    showDropdownMenu?: boolean;
    options: DropdownOption[];
    children: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ showDropdownMenu, options, children }) => {
    const pathname = usePathname();
    
    let hideDropdownMenu = pathname?.includes('respondForm') ?? false;
    hideDropdownMenu = hideDropdownMenu || pathname?.split('/')[1] === 'createForm';
    hideDropdownMenu = showDropdownMenu === undefined ? hideDropdownMenu : !showDropdownMenu;

    return (
        <div className="flex relative justify-center h-full bg-[#1e1e1e] p-4 overflow-hidden">
            {!hideDropdownMenu && (
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
            <div className='h-full mt-20'>
                {children}
            </div>
        </div>
    )
}

export default Skeleton;