import { usePathname } from 'next/navigation';
import FormOptionsDropdown from '@/components/layout/dropdown';
import { DropdownOption } from '@/components/layout/dropdown';

interface SkeletonProps {
    options: DropdownOption[];
    children: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ options, children }) => {
    const pathname = usePathname();
    const isReplyForm = pathname?.includes('respondForm') ?? false;

    return (
        <div className="flex relative justify-center h-full bg-[#151515] p-4 shadow-lg overflow-hidden">
            {!isReplyForm && (
                <div className="absolute top-6 right-6">
                    <FormOptionsDropdown options={options}/>
                </div>
            )}
            <div className="absolute top-6 left-6">
                <h1 className='bg-clip-text text-[#f6f6f6] text-4xl font-bold tracking-tight'>
                    EasyForm
                </h1>
            </div>
            <div className='h-full mt-20'>
                {children}
            </div>
        </div>
    )
}

export default Skeleton;