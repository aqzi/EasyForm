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

        const forms = await prisma.formCreator.findMany({
            where: {
                userId
            },
            include: {
                form: {
                    include: {
                        _count: {
                            select: { formResponses: true }
                        }
                    }
                }
            }
        })

        const formSelection = forms.map((formCreator) => ({
            formId: formCreator.form.id,
            title: formCreator.form.title,
            createdAt: formCreator.form.createdAt.toISOString(),
            responses: formCreator.form._count.formResponses
        }))

        return NextResponse.json(formSelection, { status: 200 });
    } catch (error) {
        console.error('Error fetching forms:', error);
        return NextResponse.json({ error: 'Error fetching forms' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}