import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface TodoUser {
    user_id: number;
    todo_id: number;
}
export const POST = async (req: Request) => {
    const data = await req.json();
    const newUserTodo = await prisma.userTodo.create({
        data,
    });
    return NextResponse.json(newUserTodo);
};
