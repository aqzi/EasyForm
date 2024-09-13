"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

//After the login, the user is redirected to this page and once the session is loaded, 
//the user is redirected another time to the myForms page which is a protected uri and can only be accessed by authenticated users.

export default function Dashboard() {
    const router = useRouter()
    const session = useSession()

    useEffect(() => {
      router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/myForms`)
    }, [router])

    return null
}