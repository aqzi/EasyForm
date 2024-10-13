'use client'

import React, { useEffect } from 'react'
import Skeleton from '@/components/layout/skeleton';
import useFormEditorStore from '@/store/formEditor';
import FormEditor from '@/components/formEditor';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getFormResponse } from '@/services/formService';
import { useQuery } from '@tanstack/react-query';

const ViewForm: React.FC = () => {
    const { setTitle, setFormFields } = useFormEditorStore((state) => ({
        setTitle: state.setTitle,
        setFormFields: state.setFormFields,
    }))

    const router = useRouter();
    const session = useSession();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    if (!formId) return null;

    const { isPending, error, data } = useQuery({
        queryKey: ['formResponse', formId],
        queryFn: () => getFormResponse(formId),
    })

    useEffect(() => {
        if(!isPending && !error && data) {
            console.log(data)

            setTitle(data.title)
            setFormFields(data.formFields)
        }
    }, [isPending, error]);

    return (
        <Skeleton options={['createForm', 'myForms', 'settings']}>
            <FormEditor formActivity='view' />
        </Skeleton>
    )
}

export default ViewForm