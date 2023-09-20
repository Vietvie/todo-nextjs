import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const DELETE = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json(
        { status: 'success', data: { id } },
        { status: 200 }
    );
};

export const GET = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    const todoByUser = await prisma.user.findFirst({
        where: {
            id,
        },
        include: {
            onwer: true,
            todos: {
                include: {
                    todo: true,
                },
            },
        },
    });

    return NextResponse.json(todoByUser);
};

export const PUT = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    let data = await req.json();
    const acceptFiled = ['name'];

    //Remove field not accept
    Object.keys(data).forEach((el: string) => {
        if (!acceptFiled.includes(el)) delete data[el];
    });
    const userUpdated = await prisma.user.update({
        where: { id },
        data,
    });
    return NextResponse.json(userUpdated);
};
