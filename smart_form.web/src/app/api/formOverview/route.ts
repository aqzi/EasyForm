import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const userId = req.auth.user?.id

    try {
        const forms = await prisma.formCreator.findMany({
            where: {
                userId
            },
            include: {
                form: {
                    include: {
                        formResponses: true
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
})