import React from 'react'
import Link from 'next/link'
import { Zap, Smile, Sliders, Lock } from 'lucide-react'
import LoginBtn from '@/components/auth/loginBtn'
import { cookies } from 'next/headers'
import ThemeToggle from '@/components/layout/themeToggle'
import { auth } from '@/auth'
import AIBrain from '@/components/customSvg/aiBrain'
import FeedbackForm from '@/components/forms/FeedbackForm'

export default async function Home() {
    const cookieStore = cookies()
    const isDarkMode = cookieStore.get('darkMode')?.value === 'true'
    const session = await auth()

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-12">
                <nav className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">EasyForm</h1>
                    <div className="flex items-center space-x-4">
                        {/* <ThemeToggle isDarkMode={isDarkMode} /> */}
                        <LoginBtn isDarkMode={isDarkMode} />
                    </div>
                </nav>

                <div className="text-center mb-16 mt-32 items-center flex flex-col justify-center">
                    {/* <h2 className="text-5xl font-bold mb-6">Create Intelligent Forms with Ease</h2>
                    <p className="text-xl mb-16">EasyForm revolutionizes the way you collect and analyze data.</p> */}
                    <h2 className="text-5xl font-bold mb-6">Unlock faster access to what matters most</h2>
                    <p className="text-2xl mb-16">Accelerate application validation with the power of AI</p>
                    <Link
                        href="/createForm"
                        prefetch={true}
                        className="bg-[#2c2c2c] text-white border border-[#34d399] px-5 py-2 rounded-md text-xl font-bold hover:bg-[#1a6046] transition-colors inline-block"
                    >
                        Get started
                    </Link>
                    <img className='mt-24 mb-40 mx-20 border rounded-lg border-gray-700 xl:w-4/5 w-full drop-shadow-[8px_8px_15px_rgba(0,100,255,0.5)]' src="/demoView.png" alt="" />
                </div>
                <div className={'p-8 lg:p-14 xl:p-20'}>
                    <div className='max-w-screen-lg mx-auto flex flex-wrap items-center'>
                        <div className="w-full sm:w-1/3 p-6">
                            <div className="">
                                <div className="flex justify-center items-center h-full">
                                    <div className="relative flex items-center justify-center w-44 h-44">
                                        <svg
                                            aria-hidden="true"
                                            className="w-44 h-44 text-gray-200 animate-spin dark:text-[#2e2e2e] fill-[#8f9bd4]"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center">
                                            {/* <span className="text-lg font-bold text-white">Validating...</span> */}
                                            <span className="text-7xl mt-2">🧐</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-2/3 text-left sm:px-6">
                            <h3 className={'sm:text-5xl text-xl text-white font-semibold'}>
                                The Problem
                            </h3>
                            <div className="mt-6 sm:text-2xl text-2xl text-gray-300 text-left">
                                Manual form validation is <b className='text-red-400'>time-consuming</b> and <b className='text-red-400'>error-prone</b>, 
                                leading to delays in processing applications. <br/>
                                Weather, it's a job application, a loan request, or unemployment benefits, 
                                manual validation is a bottleneck in the process and causes frustration.
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'p-8 lg:p-14 xl:p-20'}>
                    <div className='max-w-screen-lg mx-auto flex flex-wrap items-center'>
                        <div className="w-full sm:w-1/3 text-center sm:px-6">
                            <AIBrain/>
                        </div>
                        <div className="w-full sm:w-2/3 p-6">
                            <h3 className={'sm:text-5xl text-xl text-white font-semibold'}>
                                Our Solution
                            </h3>
                            <div className="mt-6 sm:text-2xl text-2xl text-gray-300">
                                By leveraging AI for the initial form validation, we can greatly <b className='text-green-400'>reduce the workload</b> for human reviewers. <br/>
                                AI evaluates the form against predefined guidelines, identifying only the items that don't comply. This allows
                                human reviewers to concentrate on the flagged issues, which saves time. 
                                This approach also helps <b className='text-green-400'>minimize errors</b> by incorporating a dual validation process.
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-52 mx-20'>
                    <h1 className='text-5xl'>Key Features</h1>
                    <div className="grid md:grid-cols-2 gap-8 mb-16 mt-16">
                    {[
                        { icon: Zap, title: 'AI-Powered', description: 'Leverage machine learning for smarter form creation and analysis.' },
                        { icon: Smile, title: 'User-Friendly', description: 'Intuitive interface for effortless form design and management.' },
                        { icon: Sliders, title: 'Customizable', description: 'Tailor forms to your specific needs with advanced customization options.' },
                        { icon: Lock, title: 'Data Protection', description: 'Your information, safeguarded with advanced security.' },
                        // { icon: Sliders, title: 'Transparancy', description: 'Tailor forms to your specific needs with advanced customization options.' },
                        // { icon: Sliders, title: 'Seamless Integration', description: 'Effortlessly connect with your favorite tools and platforms.' },
                    ].map((feature, index) => (
                        <div key={index} className={`${isDarkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-[#000]'} p-6 rounded-lg shadow-lg border `}>
                        <feature.icon className="h-12 w-12 mb-4 text-blue-400 stroke-1" />
                        <h3 className="text-3xl font-semibold mb-3">{feature.title}</h3>
                        <p className='text-[#959595] text-xl'>{feature.description}</p>
                        </div>
                    ))}
                    </div>
                </div>
                {/* <div className={'p-8 lg:p-14 xl:p-20'}>
                    <div className='max-w-screen-lg mx-auto flex flex-wrap'>
                        <div className="w-full sm:w-1/2 p-6">
                            <h3 className={'sm:text-5xl text-xl text-white font-semibold'}>
                                Get in touch
                            </h3>
                            <div className="mt-6 sm:text-2xl text-xs text-gray-300">
                                {`I'd love to hear from you. Whether you have a question, an exciting
                                opportunity, or simply want to say hello, feel free to fill out the
                                form. I'll make sure to get back to you as soon as possible.`}
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 text-left sm:px-6">
                            <FeedbackForm />
                        </div>
                    </div>
                </div> */}
                <div className='p-8 lg:p-14 xl:p-20 text-center mt-52 flex flex-col items-center'>
                    <h1 className='w-full text-5xl mb-10'>Join Our Beta Today!</h1>
                    <h2 className='w-full text-3xl'>Don't see what you need? <br/> No problem — just let us know, and we'll make it happen. 😎</h2>       
                    <div className="w-1/2 text-left mt-32">
                        <FeedbackForm />
                    </div>
                </div>
            </div>
        </main>
    )
}