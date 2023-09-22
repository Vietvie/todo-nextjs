import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
    const allUser = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    return NextResponse.json({
        status: 'success',
        data: {
            allUser,
        },
    });
};
