'use client'

import React, { useState, useEffect } from 'react'
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFormToReply, replyForm } from '@/services/formService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const RespondForm = () => {
    const queryClient = useQueryClient();

    const session = useSession()
    const router = useRouter();

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    if (!formId) return null;

    const { sortableItems, setTitle, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        setTitle: state.setTitle,
        setSortableItems: state.setSortableItems
    }))

    const { isPending, error, data } = useQuery({
        queryKey: ['form', formId],
        queryFn: () => getFormToReply(formId),
    })

    const mutation = useMutation({
        mutationFn: replyForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['formResponse']});
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        },
        onError: (error) => {
            console.error('Error adding form:', error);
        },
    });

    useEffect(() => {
        if(!isPending && !error && data) {
            setTitle(data.title)
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
            <Skeleton options={['createForm', 'myForms', 'settings']}>
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
            </Skeleton>
        </div>
    )
}

export default RespondForm