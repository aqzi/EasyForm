"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
    const router = useRouter()
    const session = useSession()

    useEffect(() => {
      router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/createForm`)
    }, [router])

    return null
}