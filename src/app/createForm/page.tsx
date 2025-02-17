'use client'

import React, { useEffect, useState } from 'react'
import Plus from '@/components/formEditor/buttons/plus';
import Save from '@/components/formEditor/buttons/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormEditor from '@/components/formEditor';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addForm } from '@/services/formService';

const CreateForm = () => {
    const [clickedSave, setClickedSave] = useState(false);
    const queryClient = useQueryClient();

    const session = useSession()
    const router = useRouter();

    const { title, formFields, errorMessage, addFormField, resetForm, setErrorMessage } = useFormEditorStore((state) => ({
        title: state.title,
        formFields: state.formFields,
        errorMessage: state.errorMessage,
        addFormField: state.addFormField,
        resetForm: state.resetForm,
        setErrorMessage: state.setErrorMessage
    }))

    const mutation = useMutation({
        mutationFn: addForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['forms']});
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        },
        onError: (error) => {
            console.error('Error adding form:', error);
        },
    });

    useEffect(() => {
        resetForm();
    }, [])

    const handleAddQuestion = () => {
        addFormField()
    }

    const handleSave = async () => {
        setClickedSave(true);

        if (!validateSubmission()) {
            return;
        }

        if (!session.data?.user?.name) {
            //set data in local storage to be used after login
            localStorage.setItem('title', title);
            localStorage.setItem('formFields', JSON.stringify(formFields));

            router.push('/register');
            return;
        }

        mutation.mutate({
            title,
            formFields: formFields.map((f, index) => ({
                question: f.question,
                responseType: f.responseType,
                config: f.config,
                sequenceNumber: index + 1
            }))
        })
    };

    function validateSubmission() {
        let msg = errorMessage;

        if (title === '') msg = 'Please enter a title for the form.';
        if (formFields.length === 0) msg = 'Please add at least one question to the form.';
        if (formFields.some((f) => f.question === '')) msg = 'Please enter a question for all fields.';

        if (msg) {
            setErrorMessage(msg);
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
                  onClick={() => {
                    setErrorMessage(undefined)
                    setClickedSave(false)
                  }}
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
            <Skeleton options={session.data?.user != undefined ? ['myForms', 'settings'] : []}>
                <FormEditor formActivity='createOrEdit' />
                {(errorMessage && clickedSave) && <CustomAlert message={errorMessage} />}
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