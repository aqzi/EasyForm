import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma';

export async function GET(req: NextRequest) {
    const formId = req.nextUrl.searchParams.get('id')

    try {
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