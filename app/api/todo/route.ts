import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Todo {
    name: string;
    create_time: number;
    deadline_time: number;
    create_by_id: number;
    status: string;
}

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

    const myTodo = await prisma.todo.findMany();
    return NextResponse.json(
        {
            status: 'success',
            data: {
                myTodo,
            },
        },
        {
            status: 200,
        }
    );
}

export const POST = async (req: NextRequest) => {
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
    const data = await req.json();
    const process_by_id: number[] = data.process_by_id;
    Object.keys(data).map((el) => {
        if (el === 'process_by_id') {
            delete data[el];
        }
    });

    data.create_by_id = tokenDecoded.id;
    let newTodo = await prisma.todo.create({
        data: {
            ...data,
            assignees: {
                createMany: {
                    data: process_by_id.map((el) => ({ user_id: el })),
                },
            },
        },
        include: {
            assignees: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            create_by: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    const newTodoMaped = {
        id: newTodo.id,
        name: newTodo.name,
        deadlineTime: newTodo.deadline_time,
        createTime: newTodo.create_time,
        status: newTodo.status,
        processBy: newTodo.assignees.map((user) =>
            Object.values(user.user).join('@')
        ),
        createBy: Object.values(newTodo.create_by).join('@'),
    };
    return NextResponse.json({
        status: 'success',
        data: {
            todo: newTodoMaped,
        },
    });
};
