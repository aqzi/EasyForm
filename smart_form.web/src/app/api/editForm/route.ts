import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    try {
        const formId = req.nextUrl.searchParams.get('id')

        if (!formId) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

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
    } catch (error) {
        console.error('Error fetching forms:', error);
        return NextResponse.json({ error: 'Error fetching forms' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})

export const PUT = auth(async function PUT(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const { id, title, fields } = await req.json();
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
        }

        const updatedForm = await prisma.form.update({
            where: { id: id },
            data: {
                title: title,
                fields: {
                    upsert: fields.map((field: any) => ({
                        where: { id: field.id || 0 }, // Use 0 for new fields
                        update: {
                            question: field.question,
                            responseType: field.responseType,
                            placeholder: field.placeholder,
                            config: field.config,
                            sequenceNumber: field.sequenceNumber
                        },
                        create: {
                            question: field.question,
                            responseType: field.responseType,
                            placeholder: field.placeholder,
                            config: field.config,
                            sequenceNumber: field.sequenceNumber
                        }
                    }))
                },
            },
            include: {
                fields: true,
            },
        });

        // Delete fields that are no longer present
        const updatedFieldIds = updatedForm.fields.map((field: any) => field.id);
        await prisma.field.deleteMany({
            where: {
                formId: id,
                id: { notIn: updatedFieldIds }
            }
        });

        return NextResponse.json({ form: updatedForm }, { status: 200 });
    } catch (error) {
        console.error('Error editing form:', error);
        return NextResponse.json({ error: 'Error editing form' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})