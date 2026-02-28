import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const userId = req.auth.user?.id

    try {
        const formId = req.nextUrl.searchParams.get('id')

        if (!formId) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const response = await prisma.formResponse.findUnique({
            where: { id: formId },
            select: {
                formFieldResponses: {
                    select: {
                        formField: true,
                        fieldResponse: true
                    }
                },
                form: {
                    include: {
                        formCreators: true
                    }
                }
            }
        });

        if (!response) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        const isOwner = response.form.formCreators.some((fc: any) => fc.userId === userId);
        if (!isOwner) {
            return NextResponse.json({ error: 'Not authorized to view this response' }, { status: 403 });
        }

        const data = {
            title: response.form.title,
            formFields: response.formFieldResponses.map((fr: any) => ({
                ...fr.formField,
                response: fr.fieldResponse
            }))
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching forms:', error);
        return NextResponse.json({ error: 'Error fetching forms' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})

export const POST = auth(async function POST(req) {
    const { id, formResponses } = await req.json();
    const userId = req.auth?.user?.id ?? null;
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const formResponse = await prisma.formResponse.create({
            data: {
                formId: id,
                formFieldResponses: {
                    create: formResponses.map((response: { formFieldId: number; fieldResponse: string }) => ({
                        formFieldId: response.formFieldId,
                        fieldResponse: response.fieldResponse
                    }))
                }
            },
            include: {
                formFieldResponses: true,
            }
        });

        if (userId) {
            await prisma.formResponder.create({
                data: {
                    formResponseId: formResponse.id,
                    userId
                },
            });
        }

        return NextResponse.json({ message: "Added form response successfully" }, { status: 201 });
    } catch (error) {
        console.error('Error submitting form response:', error);
        return NextResponse.json({ error: 'Error submitting form response' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})