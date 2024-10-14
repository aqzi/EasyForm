import { User, LogOut } from "lucide-react"
import SettingsCard from "../settingsCard"

interface ProfileProps {
    activeSection: string | null
    username?: string | null
    email?: string | null
    setActiveSection: (section: string | null) => void
    signout: (callbackUrl: string) => void
}

interface SubSettingItemProps {
    title: string;
    children: React.ReactNode;
}

const SubSetting: React.FC<SubSettingItemProps> = ({ title, children }) => (
    <div className="bg-[#2c2c2c] p-4 rounded-md">
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        {children}
    </div>
);

const Profile: React.FC<ProfileProps> = ({activeSection, username, email, setActiveSection, signout}) => {
    return (
        <SettingsCard
            icon={User}
            title="Profile"
            isActive={activeSection === 'profile'}
            onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
        >
            <div className="space-y-4">
                <SubSetting title="Personal Information">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            <span className="font-semibold">Name:</span> {username || 'Not set'}
                        </p>
                        <p className="text-gray-300">
                            <span className="font-semibold">Email:</span> {email || 'Not set'}
                        </p>
                    </div>
                </SubSetting>
                {/* <SubSetting title="Preferences">
                    <p>Customize your account preferences</p>
                </SubSetting> */}
                <div className="mt-6">
                    <button
                        onClick={() => signout('/')}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#2c2c2c] border border-gray-400 rounded-md hover:bg-[#414141] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <LogOut size={18} className="mr-2 text-white" />
                        Sign out
                    </button>
                </div>
            </div>
        </SettingsCard>
    )
}

export default Profile