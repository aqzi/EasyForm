'use client'

import React, { useEffect } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';

const ViewFormResponse: React.FC = () => {
    const { title, sortableItems, setTitle, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        setTitle: state.setTitle,
        setSortableItems: state.setSortableItems,
    }))

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    useEffect(() => {
        const fetchForm = async () => {
            if (formId) {
                try {
                    const response = await fetch(`/api/viewFormResponse?id=${formId}`);

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

    return (
        <Skeleton options={['myForms', 'settings']}>
            <FormRender creatorModeIsActive={false} />
        </Skeleton>
    )
}

export default ViewFormResponse