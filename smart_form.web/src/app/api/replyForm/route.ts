import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const formId = req.nextUrl.searchParams.get('id')

        if (formId) {
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
            return NextResponse.json({ error: 'Form not found' }, { status: 400 });
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
        const { responses } = await req.json();
        const formId = req.nextUrl.searchParams.get('id')

        if (!formId) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const formResponse = await prisma.formResponse.create({
            data: {
                formId: formId,
                fieldResponses: {
                    create: responses.map((response: { fieldId: number; response: string }) => ({
                        fieldId: response.fieldId,
                        response: response.response
                    }))
                }
            },
            include: {
                fieldResponses: true,
            }
        });

        return NextResponse.json({ formResponse }, { status: 201 });
    } catch (error) {
        console.error('Error submitting form response:', error);
        return NextResponse.json({ error: 'Error submitting form response' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}