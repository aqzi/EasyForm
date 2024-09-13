'use client'

import React, { useEffect, useState } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const CreateForm = () => {
    const [alertMessage, setAlertMessage] = useState<string>();

    const session = useSession()
    const router = useRouter();

    const { title, sortableItems, addSortableItem, resetForm } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        addSortableItem: state.addSortableItem,
        resetForm: state.resetForm
    }))

    useEffect(() => {
        resetForm();
    }, [])

    const handleAddQuestion = () => {
        addSortableItem()
    }

    const handleSave = async () => {
        if (!validateSubmission()) {
            return;
        }

        if (!session.data?.user?.name) {
            router.push('/register');
            return;
        }

        try {
            const formData = {
                title,
                fields: sortableItems.map((s, index) => ({
                    question: s.question,
                    responseType: s.responseType,
                    placeholder: s.placeholder,
                    config: s.config,
                    sequenceNumber: index + 1
                }))
            };

            const response = await fetch('/api/createForm', {
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
        } catch (error) {
            console.error('Error saving form:', error);
        }
    };

    function validateSubmission() {
        let msg = undefined;

        if (title === '') msg = 'Please enter a title for the form.';
        if (sortableItems.length === 0) msg = 'Please add at least one question to the form.';
        if (sortableItems.some((s) => s.question === '')) msg = 'Please enter a question for all fields.';

        if (msg) {
            setAlertMessage(msg);
            return false;
        } else {
            return true;
        }
    }

    const CustomAlert = ({ message }: { message: string }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-[#1c1c1c] rounded-lg shadow-lg p-6 w-96 border border-gray-700">
              <h2 className="text-xl font-semibold text-white">Validation Error</h2>
              <p className="mt-4 text-gray-300">{message}</p>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setAlertMessage(undefined)}
                  className="bg-blue-500 w-full text-white px-4 py-1 items-center flex justify-center rounded hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      };

    return (
        <div className='h-screen p-4'>
            <Skeleton options={['myForms', 'settings']} showDropdownMenu={session.data?.user != undefined }>
                <FormRender formActivity='createOrEdit' />
                {alertMessage && <CustomAlert message={alertMessage} />}
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
        </div>
    )
}

export default CreateForm