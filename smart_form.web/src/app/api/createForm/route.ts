import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const POST = auth(async function POST(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const userId = req.auth.user?.id

    const { title, fields } = await req.json();

    try {
        if (!userId) {
            return NextResponse.json({ error: 'Server error' }, { status: 404 });
        }

        const form = await prisma.form.create({
            data: {
                title: title,
                fields: {
                    create: fields,
                },
            },
            include: {
                fields: true,
            },
        });

        const formCreator = await prisma.formCreator.create({
            data: {
                formId: form.id,
                userId
            },
        });

        return NextResponse.json({ form, formCreator }, { status: 201 });
    } catch (error) {
        console.error('Error creating form:', error);
        return NextResponse.json({ error: 'Error creating form' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})