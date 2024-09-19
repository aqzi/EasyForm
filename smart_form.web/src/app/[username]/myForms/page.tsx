'use client'

import React, { useState, useEffect } from 'react'
import Skeleton from '@/components/layout/skeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchForms, getFormWithResponse } from '@/services/formService';
import useFormEditorStore from '@/store/formEditor';
import TableHeader from '@/components/formsOverview/tableHeader';
import TableBody from '@/components/formsOverview/tableBody';

const MyForms: React.FC = () => {
    const router = useRouter();
    const session = useSession();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }
    
    const { resetForm } = useFormEditorStore((state) => ({
        resetForm: state.resetForm
    }))

    const { isPending, error, data } = useQuery({
        queryKey: ['forms'],
        queryFn: fetchForms
    });

    useEffect(() => {
        resetForm();
    }, [])

    // Derive formMsg from the current state
    const formMsg = isPending ? 'Loading...' : 
                    error ? error.message :
                    data.length === 0 ? 'No forms found. Create your first form!' : 
                    null;

    return (
        <Skeleton options={['createForm', 'settings']}>
            <div className='max-w-3xl mx-auto mt-8 w-[650px]'>
                <div className="relative mb-12">
                    <h1
                        className="text-4xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 px-2 py-4 rounded"
                    >
                        My Forms
                    </h1>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                </div>
                {formMsg && <p className="text-center text-gray-400">{formMsg}</p>}
                {!isPending && !error && data.length > 0 && (
                    <div className="overflow-hidden bg-transparent shadow-lg rounded-lg">
                        <table className="w-full border-separate border-spacing-y-2">
                            <TableHeader />
                            <TableBody forms={data} />
                        </table>
                    </div>
                )}
            </div>
        </Skeleton>
    );
};

export default MyForms;
