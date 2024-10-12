import Link from 'next/link';
import { signIn, auth } from '@/auth';

const generateRandomUsername = (length: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-white">
        <Link 
            href="/"
            className="absolute top-6 left-6"
        >
            <h1 className='bg-clip-text text-[#f6f6f6] text-4xl font-bold tracking-tight'>
                EasyForm
            </h1>
        </Link>
        <div className="w-full max-w-md p-8 space-y-8 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-center">
                Login to Your Account
            </h2>
            <p className="text-center">Choose a provider to login</p>
            <form
                className="space-y-4"
                action={async (formData: FormData) => {
                    "use server"
                    const tmp = formData.get('provider') as string
                    const uri = `/${generateRandomUsername(15)}`
                    await signIn(tmp, { redirectTo: uri })
                }}
            >
                <button 
                    name='provider'
                    type='submit' 
                    value='google'
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Continue with Google
                </button>
                <div 
                    // name='provider'
                    // type='submit' 
                    // value='microsoft'
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-500 border border-gray-700 text-white hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                    Continue with Microsoft (coming soon)
                </div>
                <div 
                    // name='provider'
                    // type='submit' 
                    // value='facebook'
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-500 border border-gray-700 text-white hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                    Continue with Facebook (coming soon)
                </div>
            </form>
        </div>
    </div>
  );
};

export default Register;
