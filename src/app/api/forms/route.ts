import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
    const formId = req.nextUrl.searchParams.get('id')

    //When formId is present, no auth is required because users have to be able to access the form without logging in when receiving a public link
    if (formId) {
        try {
            const form = await prisma.form.findUnique({
                where: { id: formId },
                include: {
                    formFields: true
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
    } else {
        if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        const userId = req.auth.user?.id

        try {
            if (!userId) {
                return NextResponse.json({ error: 'Server error' }, { status: 404 });
            }
    
            const forms = await prisma.formCreator.findMany({
                where: {
                    userId
                },
                include: {
                    form: {
                        include: {
                            formResponses: {
                                include: {
                                    formResponder: {
                                        include: {
                                            user: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
    
            const formSelection = forms.map((f: any) => ({
                formId: f.form.id,
                title: f.form.title,
                createdAt: f.form.createdAt.toISOString(),
                responses: f.form.formResponses.map((r: any) => ({
                    responseId: r.id,
                    submittedAt: r.submitted_at.toISOString(),
                    responder: r.formResponder !== null ? r.formResponder.user.name : 'Anonymous'
                    //maybe extend with total time taken to fill the form
                }))
            }))
    
            return NextResponse.json(formSelection, { status: 200 });
        } catch (error) {
            console.error('Error fetching forms:', error);
            return NextResponse.json({ error: 'Error fetching forms' }, { status: 500 });
        } finally {
            await prisma.$disconnect();
        }
    }
})

export const POST = auth(async function POST(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const userId = req.auth.user?.id

    const { title, formFields } = await req.json();

    try {
        if (!userId) {
            return NextResponse.json({ error: 'Server error' }, { status: 404 });
        }

        const form = await prisma.form.create({
            data: {
                title: title,
                formFields: {
                    create: formFields,
                },
            },
            include: {
                formFields: true,
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

export const PUT = auth(async function PUT(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const { id, title, formFields } = await req.json();
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
        }

        const updatedForm = await prisma.form.update({
            where: { id: id },
            data: {
                title: title,
                formFields: {
                    upsert: formFields.map((field: any) => ({
                        where: { id: field.id || 0 }, // Use 0 for new fields
                        update: {
                            question: field.question,
                            responseType: field.responseType,
                            config: field.config,
                            sequenceNumber: field.sequenceNumber
                        },
                        create: {
                            question: field.question,
                            responseType: field.responseType,
                            config: field.config,
                            sequenceNumber: field.sequenceNumber
                        }
                    }))
                },
            },
            include: {
                formFields: true,
            },
        });

        // Delete fields that are no longer present
        const updatedFieldIds = updatedForm.formFields.map((field: any) => field.id);
        await prisma.formField.deleteMany({
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

export const DELETE = auth(async function DELETE(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const formId = req.nextUrl.searchParams.get('id')

    try {
        if (!formId) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        await prisma.form.delete({
            where: {
                id: formId
            }
        })

        return NextResponse.json({ message: 'Form deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting form:', error);
        return NextResponse.json({ error: 'Error deleting form' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})