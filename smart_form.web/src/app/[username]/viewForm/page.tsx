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
import { getFormWithResponse } from '@/services/formService';
import { useQuery } from '@tanstack/react-query';

const ViewForm: React.FC = () => {
    const { setTitle, setSortableItems } = useFormEditorStore((state) => ({
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

    if (!formId) return null;

    const { isPending, error, data } = useQuery({
        queryKey: ['formResponse', formId],
        queryFn: () => getFormWithResponse(formId),
    })

    useEffect(() => {
        if(!isPending && !error && data) {
            setTitle(data.title)
            setSortableItems(data.fields)
        }
    }, [isPending, error]);

    return (
        <Skeleton options={['createForm', 'myForms', 'settings']}>
            <FormRender formActivity='view' />
        </Skeleton>
    )
}

export default ViewForm