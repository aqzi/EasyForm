'use client'

import React, { useRef, useState} from 'react'
import useFormEditorStore from '@/store/formEditor';
import { formActivity } from './protocol';
import Editor from './views/editor';
import { RulesEditor } from './views/rules';
import { Playground } from './views/playground';
import FormValidation from './formValidation';

const FormRender = ({formActivity}: {formActivity: formActivity}) => {
    const [activeTab, setActiveTab] = useState<'Editor' | 'Rules' | 'Playground'>('Editor');
    const [tabsAreActive, setTabsAreActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null)

    const { title, setTitle } = useFormEditorStore((state) => ({
        title: state.title,
        setTitle: state.setTitle,
    }))

    return (
        <div
            ref={containerRef}
            className="w-full max-w-5xl sm:w-4/5 xl:w-3/5 origin-center relative my-20 h-full"
        >
            <div className="h-full p-8 flex overflow-auto">
                <div className="flex-grow">
                    <div 
                        className="relative mb-12"
                        onMouseEnter={() => setTabsAreActive(true)}
                        onMouseLeave={() => setTabsAreActive(false)}
                    >
                        {
                            formActivity === 'createOrEdit' ?
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Untitled Form"
                                className="text-5xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 hover:bg-gray-800 transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                            />
                            :
                            <p className="text-5xl pb-3 font-bold mb-2 text-gray-200 w-full bg-transparent border-none px-2 py-1 rounded cursor-default">{title}</p>
                        }
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent">
                            {(tabsAreActive && formActivity === 'createOrEdit') && (
                                <div className='pt-3 flex flex-row gap-3 text-sm'>
                                    <button
                                        onClick={() => setActiveTab('Editor')}
                                        className={`px-4 py-1 rounded-md ${
                                            activeTab === 'Editor'
                                                ? 'border-[#858585] bg-[#282828] text-white'
                                                : 'border-transparent bg-[#282828] text-gray-400 hover:bg-[#353535] hover:text-white'
                                        } transition-colors duration-300`}
                                    >
                                        Editor
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Rules')}
                                        className={`px-4 py-1 rounded-md ${
                                            activeTab === 'Rules'
                                                ? 'border-[#858585] bg-[#282828] text-white'
                                                : 'border-transparent bg-[#282828] text-gray-400 hover:bg-[#353535] hover:text-white'
                                        } transition-colors duration-300`}
                                    >
                                        Rules
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Playground')}
                                        className={`px-4 py-1 rounded-md ${
                                            activeTab === 'Playground'
                                                ? 'border-[#858585] bg-[#282828] text-white'
                                                : 'border-transparent bg-[#282828] text-gray-400 hover:bg-[#353535] hover:text-white'
                                        } transition-colors duration-300`}
                                    >
                                        Playground
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {activeTab === 'Editor' && <Editor formActivity={formActivity}/>}
                    {(activeTab === 'Rules' && formActivity === 'createOrEdit') && <RulesEditor/>}
                    {(activeTab === 'Playground' && formActivity === 'createOrEdit') && <Playground/>}
                </div>
            </div>
            {formActivity === 'view' && <FormValidation/>}
        </div>
    )
}

// export default React.memo(FormRender)
export default FormRender