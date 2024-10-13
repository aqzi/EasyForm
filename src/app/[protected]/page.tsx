"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addForm } from '@/services/formService'
import { formField } from '@/components/formEditor/protocol'

//After the login, the user is redirected to this page and once the session is loaded, 
//the user is redirected another time to the myForms page which is a protected uri and can only be accessed by authenticated users.

export default function Dashboard() {
    const router = useRouter()
    const session = useSession()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['forms']});
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        },
        onError: (error) => {
            console.error('Error adding form:', error);
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        },
    });

    useEffect(() => {
        //get data from local storage if it exists
        const title = localStorage.getItem('title');
        const tmp = localStorage.getItem('formFields');

        if (title && tmp) {
            const formFields = JSON.parse(tmp) as formField[];

            mutation.mutate({
                title,
                formFields: formFields.map((f, index) => ({
                    question: f.question,
                    responseType: f.responseType,
                    config: f.config,
                    sequenceNumber: index + 1
                }))
            })

            localStorage.removeItem('title');
            localStorage.removeItem('formFields');
        } else {
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        }
    }, [router])

    return null
}