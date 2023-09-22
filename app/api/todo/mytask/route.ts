import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const tokenDecoded = decodeJwt(req);
    if (!tokenDecoded) {
        return NextResponse.json(
            {
                status: 'fail',
                message: 'please login to access',
            },
            {
                status: 400,
            }
        );
    }

    const myTask = await prisma.userTodo.findMany({
        where: {
            user_id: tokenDecoded.id,
        },
    });
    return NextResponse.json(
        {
            status: 'success',
            data: {
                myTask,
            },
        },
        {
            status: 200,
        }
    );
}
