import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formId = req.nextUrl.searchParams.get('id')

        if (formId) {
            // Get specific form
            const form = await prisma.form.findUnique({
                where: { id: formId },
                include: {
                    fields: true
                }
            });

            if (!form) {
                return NextResponse.json({ error: 'Form not found' }, { status: 404 });
            }

            return NextResponse.json(form, { status: 200 });
        } else {
            //get forms where the use is the creator of the forms
            const forms = await prisma.formCreator.findMany({
                where: {
                    userId
                },
                include: {
                    form: true
                }
            })

            const formSelection = forms.map((form) => ({
                form: form.form
            }))

            return NextResponse.json(formSelection, { status: 200 });
        }
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