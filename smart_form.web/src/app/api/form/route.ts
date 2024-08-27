import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        //get forms where the use is the creator of the forms
        const forms = await prisma.formParticipation.findMany({
            where: {
                userId,
                role: "CREATOR"
            },
            include: {
                form: true
            }
        })

        const formSelection = forms.map((form) => ({
            createdAt: form.createdAt,
            form: form.form
        }))

        return NextResponse.json(formSelection, { status: 200 });
    } catch (error) {
        console.error('Error fetching forms:', error);
        return NextResponse.json({ error: 'Error fetching forms' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, fields } = await req.json();
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) {
            return NextResponse.json({ error: 'Server error' }, { status: 404 });
        }

        const form = await prisma.form.create({
            data: {
                name: title,
                participations: {
                    create: []
                },
                
                fields: {
                    create: fields,
                },
                
            },
            include: {
                fields: true,
            },
        });

        const formParticipation = await prisma.formParticipation.create({
            data: {
                formId: form.id,
                userId,
                role: "CREATOR",
            },
        });

        return NextResponse.json({ form, formParticipation }, { status: 201 });
    } catch (error) {
        console.error('Error creating form:', error);
        return NextResponse.json({ error: 'Error creating form' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}