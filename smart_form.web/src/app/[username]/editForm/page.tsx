'use client'

import React, { useEffect } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { editForm, getForm } from '@/services/formService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const EditForm: React.FC = () => {
    const { title, sortableItems, addSortableItem, setTitle, setRules, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        addSortableItem: state.addSortableItem,
        setTitle: state.setTitle,
        setRules: state.setRules,
        setSortableItems: state.setSortableItems,
    }))

    const router = useRouter();
    const session = useSession();
    const queryClient = useQueryClient();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    if (!formId) return null;

    const { isPending, error, data } = useQuery({
        queryKey: ['form', formId],
        queryFn: () => getForm(formId),
    })

    const mutation = useMutation({
        mutationFn: editForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['form', formId]});
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        },
        onError: (error) => {
            console.error('Error updating form:', error);
        },
    });

    useEffect(() => {
        if(!isPending && !error && data) {
            setTitle(data.title)
            setRules(data.rules)
            setSortableItems(data.fields)
        }
    }, [isPending, error]);

    const updateForm = async () => {
        mutation.mutate({
            id: formId,
            title,
            fields: sortableItems.map((s, index) => ({
                id: s.id,
                question: s.question,
                responseType: s.responseType,
                placeholder: s.placeholder,
                config: s.config,
                sequenceNumber: index + 1
            }))
        })
    };

    const handleAddQuestion = () => {
        addSortableItem()
    }

    return (
        <Skeleton options={['createForm', 'myForms', 'settings']}>
            <FormRender formActivity='createOrEdit' />
            <div className="absolute bottom-8 right-8 flex space-x-4">
                <button
                    onClick={updateForm}
                    className="group relative w-16 h-16 bg-transparent border-none focus:outline-none"
                    aria-label="Save form"
                >
                    <Save/>
                    <span className="absolute inset-0 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out">
                        Save
                    </span>
                </button>

                <button
                    onClick={handleAddQuestion}
                    className="group relative w-16 h-16 bg-transparent border-none focus:outline-none"
                    aria-label="Add new form"
                >
                    <Plus/>
                    <span className="absolute inset-0 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out">
                        New
                    </span>
                </button>
            </div>
        </Skeleton>
    )
}

export default EditForm