import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import signToken from '../createToken';

interface SignupField {
    email: string;
    name: string;
    password: string;
}

export const POST = async (req: Request) => {
    try {
        const data: SignupField = await req.json();
        const newUser = await prisma.user.create({
            data,
        });
        const token = signToken(newUser.id);
        return NextResponse.json({
            status: 'success',
            data: {
                token,
                user: newUser,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'fail',
            },
            {
                status: 500,
            }
        );
    }
};
