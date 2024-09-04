'use client'

import React, { useState } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';

const CreateForm = () => {
    const { title, sortableItems, addSortableItem } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        addSortableItem: state.addSortableItem,
    }))

    const handleAddQuestion = () => {
        addSortableItem()
    }

    const handleSave = async () => {
        try {
            const formData = {
                title,
                fields: sortableItems.map((s, index) => ({
                    question: s.question,
                    responseType: s.responseType,
                    response: s.response,
                    placeholder: s.placeholder,
                    config: s.config,
                    sequenceNumber: index + 1
                }))
            };

            const response = await fetch('/api/form', {
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

    return (
        <Skeleton options={['myForms', 'statistics', 'settings']}>
            <FormRender creatorModeIsActive={true} endpoint="form"/>
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
    )
}

export default CreateForm