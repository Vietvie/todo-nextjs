import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    const todoByUser = await prisma.todo.findFirst({
        where: {
            id,
        },
        include: { assignees: true },
    });

    return NextResponse.json(todoByUser);
};

export const DELETE = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json(
        {
            status: 'success',
            message: `Detele success Todo id: ${id}`,
        },
        { status: 200 }
    );
};
