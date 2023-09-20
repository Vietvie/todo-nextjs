import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const data: { email: string; name: string } = await req.json();
    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
        },
    });

    return NextResponse.json(newUser, { status: 201 });
};
