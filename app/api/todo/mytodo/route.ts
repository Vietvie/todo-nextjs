import APIFeature from '@/lib/ApiFeature';
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
    const searchParams = req.nextUrl.searchParams;
    let queryObj: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
        queryObj[key] = value;
    });

    const queryPrismaNoPagination = new APIFeature(queryObj).filter().query;
    const queryPrisma = new APIFeature(queryObj).filter().pagination().query;

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

    try {
        const allTodo = await prisma.todo.count({
            ...queryPrismaNoPagination,
            where: {
                ...queryPrismaNoPagination.where,
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
        });

        const myTodo = await prisma.todo.findMany({
            ...queryPrisma,
            where: {
                ...queryPrisma.where,
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

        const myTodoMaped = myTodo.map((el) => ({
            id: el.id,
            status: el.status,
            name: el.name,
            createTime: el.create_time,
            deadlineTime: el.deadline_time,
            processBy: el.assignees.map((el) => el.user),
            createBy: Object.values(el.create_by).join('@'),
        }));

        return NextResponse.json(
            {
                status: 'success',
                results: myTodoMaped.length,
                page: queryPrisma.skip! / queryPrisma.take! + 1,
                limit: queryPrisma.take!,
                allTodo,
                data: {
                    myTodoMaped,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                status: 'fail',
            },
            {
                status: 400,
            }
        );
    }
}

// export const POST = async (req: Request) => {
//     const data = await req.json();
//     const newTodo = await prisma.todo.create({
//         data,
//     });
//     return NextResponse.json(newTodo);
// };
