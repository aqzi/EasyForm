'use client'

import React, { useRef, useState} from 'react'
import useFormEditorStore from '@/store/formEditor';
import { formActivity } from './protocol';
import EditorBody from './layout/editorBody';
import EditorHeader from './layout/editorHeader';

const FormEditor = ({formActivity}: {formActivity: formActivity}) => {
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
                    <EditorHeader formActivity={formActivity}/>
                    <EditorBody formActivity={formActivity}/>
                </div>
            </div>
        </div>
    )
}

export default FormEditor