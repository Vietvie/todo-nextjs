import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Todo {
    name: string;
    create_time: number;
    deadline_time: number;
    create_by_id: number;
    status: string;
}

export async function GET() {
    const allTodo = await prisma.todo.findMany();
    return NextResponse.json(
        {
            status: 'success',
            data: {
                allTodo,
            },
        },
        {
            status: 200,
        }
    );
}

export const POST = async (req: Request) => {
    const data = await req.json();
    const newTodo = await prisma.todo.create({
        data,
    });
    return NextResponse.json(newTodo);
};
