'use client'

import React, { useState, useEffect } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';

const RespondForm = () => {
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    const { title, sortableItems, setTitle, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        setTitle: state.setTitle,
        setSortableItems: state.setSortableItems
    }))

    useEffect(() => {
        const fetchForm = async () => {
            if (formId) {
                try {
                    const response = await fetch(`/api/replyForm?id=${formId}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch form');
                    }

                    const data = await response.json();
                    
                    setTitle(data.title)
                    setSortableItems(data.fields)
                } catch (error) {
                    console.error('Error fetching form:', error);
                }
            }
        };

        fetchForm();
    }, [formId]);

    const handleSave = async () => {
        if (formId) {
            try {
                const formData = {
                    responses: sortableItems.map((s, index) => ({
                        response: s.response,
                        fieldId: s.id,
                        sequenceNumber: index + 1
                    }))
                };
    
                const response = await fetch(`/api/replyForm?id=${formId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to save form');
                }
    
                const result = await response.json();
                console.log('Form saved successfully:', result);
    
                setSavedSuccessfully(true);
            } catch (error) {
                console.error('Error saving form:', error);
            }
        }
    };

    return (
        <div className="h-screen">
            <Skeleton options={[]}>
                {
                    !savedSuccessfully ? 
                    <>
                        <FormRender formActivity='reply' />
                        <div className="absolute bottom-8 right-8 flex space-x-4">
                            <button
                                onClick={handleSave}
                                className="group relative w-16 h-16 bg-transparent border-none focus:outline-none"
                                aria-label="Save form"
                            >
                                <Save/>
                                <span className="absolute inset-0 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out">
                                    Save
                                </span>
                            </button>
                        </div>
                    </>
                    :
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 -mt-20">
                        <div className="bg-[#eaeaea] p-8 rounded-lg shadow-xl max-w-md w-full">
                            <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="text-4xl font-bold mb-4 text-gray-800">Thank You!</h1>
                            <p className="text-xl mb-8 text-gray-600">Your response has been successfully submitted.</p>
                            <div className="text-lg">
                                <p className="text-gray-500">Powered by</p>
                                <p className="font-semibold text-3xl text-blue-600 mt-2">EasyForm</p>
                            </div>
                        </div>
                    </div>
                }
            </Skeleton>
        </div>
    )
}

export default RespondForm