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

const EditForm: React.FC = () => {
    const { title, sortableItems, addSortableItem, setTitle, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        addSortableItem: state.addSortableItem,
        setTitle: state.setTitle,
        setSortableItems: state.setSortableItems,
    }))

    const router = useRouter();
    const session = useSession();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    useEffect(() => {
        const fetchForm = async () => {
            if (formId) {
                try {
                    const response = await fetch(`/api/editForm?id=${formId}`);

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

    const updateForm = async () => {
        try {
            const formData = {
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
            };

            const response = await fetch('/api/editForm', {
                method: 'PUT',
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
        } catch (error) {
            console.error('Error saving form:', error);
        }
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