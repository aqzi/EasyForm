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
            fields: response.fieldResponses.map(fr => ({
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
}