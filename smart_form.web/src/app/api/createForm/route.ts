import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    const { title, fields } = await req.json();
    const session = await auth()
    const userId = session?.user?.id

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
}