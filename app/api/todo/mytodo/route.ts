import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface Todo {
    name: string;
    create_time: number;
    deadline_time: number;
    create_by_id: number;
    status: string;
}

export async function GET(req: NextRequest) {
    const tokenDecoded: jwt.JwtPayload | string | undefined = decodeJwt(req);

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

    const myTodo = await prisma.todo.findMany({
        where: {
            OR: [
                {
                    create_by_id: tokenDecoded.id,
                },
                {
                    assignees: {
                        some: {
                            user_id: tokenDecoded.id,
                        },
                    },
                },
            ],
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
                    todo: true,
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

    // id: number;
    // name: { value: string; editing: boolean };
    // createTime: number;
    // deadlineTime: number;
    // status: string;
    // createBy: string;
    // processBy: string[];

    const myTodoMaped = myTodo.map((el) => ({
        id: el.id,
        status: el.status,
        name: el.name,
        createTime: el.create_time,
        deadlineTime: el.deadline_time,
        processBy: el.assignees.map((user) =>
            Object.values(user.user).join('@')
        ),
        createBy: Object.values(el.create_by).join('@'),
    }));
    return NextResponse.json(
        {
            status: 'success',
            results: myTodoMaped.length,
            data: {
                myTodoMaped,
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
