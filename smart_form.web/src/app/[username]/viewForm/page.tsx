'use client'

import React, { useEffect } from 'react'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormRender from '@/components/formEditor/formRender';
import { useSearchParams } from 'next/navigation';

const ViewForm: React.FC = () => {
    const { setTitle, setSortableItems } = useFormEditorStore((state) => ({
        setTitle: state.setTitle,
        setSortableItems: state.setSortableItems,
    }))

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    useEffect(() => {
        const fetchForm = async () => {
            if (formId) {
                try {
                    const response = await fetch(`/api/viewForm?id=${formId}`);

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
        <Skeleton options={['createForm', 'myForms', 'settings']}>
            <FormRender formActivity='view' />
        </Skeleton>
    )
}

export default ViewForm