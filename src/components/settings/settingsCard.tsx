import { LucideIcon, ChevronDown } from 'lucide-react';

interface SettingsCardProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

//Each setting item should be wrapped in this card! (see ./items/Profile.tsx as an example)
const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, children, isActive, onClick }) => (
    <section
        className={`bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700 transition-all duration-300 w-full ${
            isActive ? 'shadow-lg ring-1 ring-[#8f9bd4]' : 'hover:shadow-lg hover:from-indigo-50 hover:to-white'
        }`}
    >
        <h2
            className={`text-xl font-semibold flex items-center justify-between cursor-pointer p-6 text-white`}
            onClick={onClick}
        >
            <span className="flex items-center">
                <Icon className={`mr-3 h-7 w-7 text-white`} />
                <span className="transition-colors duration-200">{title}</span>
            </span>
            <ChevronDown 
                className={`h-6 w-6 text-gray-400 transition-transform duration-300 transform ${isActive && 'rotate-180'}`} 
            />
        </h2>
        <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out space-y-4 ${
            isActive ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
        }`}>
            {children}
        </div>
    </section>
);

export default SettingsCard;