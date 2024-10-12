"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useFormEditorStore from '@/store/formEditor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addForm } from '@/services/formService'
import { sortableItem } from '@/components/formEditor/protocol'

//After the login, the user is redirected to this page and once the session is loaded, 
//the user is redirected another time to the myForms page which is a protected uri and can only be accessed by authenticated users.

export default function Dashboard() {
    const router = useRouter()
    const session = useSession()
    const queryClient = useQueryClient();

    const { title, sortableItems, formCreatedBeforeLogin, setFormCreatedBeforeLogin } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        formCreatedBeforeLogin: state.formCreatedBeforeLogin,
        setFormCreatedBeforeLogin: state.setFormCreatedBeforeLogin,
    }))

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
        const tmp = localStorage.getItem('sortableItems');

        if (title && tmp) {
            const sortableItems = JSON.parse(tmp) as sortableItem[];

            mutation.mutate({
                title,
                fields: sortableItems.map((s, index) => ({
                    question: s.question,
                    responseType: s.responseType,
                    placeholder: s.placeholder,
                    config: s.config,
                    sequenceNumber: index + 1
                }))
            })

            localStorage.removeItem('title');
            localStorage.removeItem('sortableItems');
        } else {
            router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
        }
    }, [router])

    return null
}