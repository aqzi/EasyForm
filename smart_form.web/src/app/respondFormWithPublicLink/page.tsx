'use client'

import React, { useState, useEffect } from 'react'
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getForm, respondForm } from '@/services/formService';
import { useSession } from 'next-auth/react';

const RespondFormWithPublicLink = () => {
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);

    const queryClient = useQueryClient();

    const session = useSession()

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    if (!formId) return null;

    const { sortableItems, setTitle, setRules, setSortableItems } = useFormEditorStore((state) => ({
        sortableItems: state.sortableItems,
        setTitle: state.setTitle,
        setRules: state.setRules,
        setSortableItems: state.setSortableItems
    }))

    const { isPending, error, data } = useQuery({
        queryKey: ['form', formId],
        queryFn: () => getForm(formId),
    })

    const mutation = useMutation({
        mutationFn: respondForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['formResponse']});
            setSavedSuccessfully(true);
        },
        onError: (error) => {
            console.error('Error adding form:', error);
        },
    });

    useEffect(() => {
        if(!isPending && !error && data) {
            setTitle(data.title)
            setRules(data.rules)
            setSortableItems(data.fields)
        }
    }, [isPending, error]);

    const handleSave = async () => {
        mutation.mutate({
            id: formId,
            userId: session.data?.user?.id || null,
            responses: sortableItems.map((s, index) => ({
                response: s.response,
                fieldId: s.id,
                sequenceNumber: index + 1
            }))
        })
    };

    return (
        <div className="h-screen">
            <Skeleton options={session.data?.user != undefined ? ['createForm', 'myForms', 'settings'] : []}>
                {
                    isPending ? 
                    <div className='flex flex-row text-3xl mt-20'>
                        <svg className="animate-spin h-8 w-8 mr-3 ..." viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h1>Loading...</h1>
                    </div>
                    :
                    <>
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
                    </>
                }
            </Skeleton>
        </div>
    )
}

export default RespondFormWithPublicLink