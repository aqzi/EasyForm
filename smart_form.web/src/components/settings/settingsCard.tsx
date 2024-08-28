import { LucideIcon, ChevronDown } from 'lucide-react';

interface SettingsCardProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, children, isActive, onClick }) => (
    <section
        className={`bg-gradient-to-br from-white to-gray-50 shadow-md rounded-lg transition-all duration-300 w-full ${
            isActive ? 'shadow-lg ring-2 ring-indigo-500' : 'hover:shadow-lg hover:from-indigo-50 hover:to-white'
        }`}
    >
        <h2
            className={`text-xl font-semibold flex items-center justify-between cursor-pointer p-6 ${
            isActive ? 'text-indigo-700' : 'text-gray-700 hover:text-indigo-600'
            }`}
            onClick={onClick}
        >
            <span className="flex items-center">
                <Icon className={`mr-3 h-7 w-7 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                <span className="transition-colors duration-200">{title}</span>
            </span>
            <ChevronDown 
                className={`h-6 w-6 ${isActive ? 'text-indigo-500' : 'text-gray-400'} transition-transform duration-300 transform ${
                    isActive ? 'rotate-180' : ''
                }`} 
            />
        </h2>
        <div className={`px-6 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isActive ? 'max-h-[1000px]' : 'max-h-0'
        }`}>
            {children}
        </div>
    </section>
);

export default SettingsCard;