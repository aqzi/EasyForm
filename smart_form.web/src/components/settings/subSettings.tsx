interface SubSettingItemProps {
    title: string;
    children: React.ReactNode;
}

interface SubSettingsProps {
    isVisible: boolean;
    children: React.ReactNode;
}

export const SubSettings: React.FC<SubSettingsProps> = ({ isVisible, children }) => (
    <div
        className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${
            isVisible ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
        }`}
    >
        {children}
    </div>
);

export const SubSettingItem: React.FC<SubSettingItemProps> = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
        {children}
    </div>
);