import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    try {
        const formId = req.nextUrl.searchParams.get('id')

        if (!formId) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const response = await prisma.formResponse.findUnique({
            where: { id: formId },
            select: {
                fieldResponses: {
                    select: {
                        field: true,
                        response: true
                    }
                },
                form: true
            }
        });

        if (!response) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        const data = {
            title: response.form.title,
            fields: response.fieldResponses.map((fr: any) => ({
                ...fr.field,
                response: fr.response
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

export async function POST(req: NextRequest) {
    const { id, userId, responses } = await req.json();
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const formResponse = await prisma.formResponse.create({
            data: {
                formId: id,
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
}