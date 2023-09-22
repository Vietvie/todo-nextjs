import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
    req: Request,
    { params }: { params: { id: number } }
) => {
    const id = params.id * 1;
    const todoByUser = await prisma.todo.findFirst({
        where: {
            id,
        },
        include: { assignees: true },
    });

    return NextResponse.json(todoByUser);
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
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
    const id = params.id * 1;

    const currentTodo = await prisma.todo.findUnique({
        where: {
            id,
            create_by_id: tokenDecoded.id,
        },
    });

    if (!currentTodo)
        return NextResponse.json({
            status: 'fail',
            message: `You are not the owner of todo ${id}`,
        });

    await prisma.todo.delete({ where: { id } });
    return NextResponse.json(
        {
            status: 'success',
            message: `Detele success Todo id: ${id}`,
        },
        { status: 200 }
    );
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
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
    const id = params.id * 1;
    const data:
        | { status?: string; deadlineTime?: number; processBy?: number[] }
        | undefined = await req.json().catch((err) => console.log(err));

    //Update Status By Asignees
    if (data?.status) {
        try {
            const todoUpdateStatus = await prisma.todo.update({
                data: {
                    status: data.status,
                },
                where: {
                    id,
                    assignees: {
                        some: {
                            user_id: tokenDecoded.id,
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

            const myTodoMaped = {
                id: todoUpdateStatus.id,
                status: todoUpdateStatus.status,
                name: todoUpdateStatus.name,
                createTime: todoUpdateStatus.create_time,
                deadlineTime: todoUpdateStatus.deadline_time,
                processBy: todoUpdateStatus.assignees.map((el) => el.user),
                createBy: Object.values(todoUpdateStatus.create_by).join('@'),
            };
            return NextResponse.json({
                status: 'success',
                data: {
                    todoUpdated: myTodoMaped,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json({
                        status: 'fail',
                        message: 'You do not have permission',
                    });
            }
            console.log(error);
        }
    }

    // Update Deadline By Owner
    if (data?.deadlineTime) {
        try {
            const todoUpdateDeadline = await prisma.todo.update({
                where: {
                    id,
                    create_by_id: tokenDecoded.id,
                },
                data: {
                    deadline_time: data.deadlineTime,
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

            const myTodoMaped = {
                id: todoUpdateDeadline.id,
                status: todoUpdateDeadline.status,
                name: todoUpdateDeadline.name,
                createTime: todoUpdateDeadline.create_time,
                deadlineTime: todoUpdateDeadline.deadline_time,
                processBy: todoUpdateDeadline.assignees.map((el) => el.user),
                createBy: Object.values(todoUpdateDeadline.create_by).join('@'),
            };

            return NextResponse.json({
                status: 'success',
                data: {
                    todoUpdated: myTodoMaped,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json({
                        status: 'fail',
                        message: 'You do not have permission',
                    });
            }
            console.log(error);
        }
    }

    //Update Assignees By Owner
    if (data?.processBy) {
        try {
            const todoUpdateAssignees = await prisma.todo.update({
                where: {
                    id,
                    create_by_id: tokenDecoded.id,
                },
                data: {
                    assignees: {
                        createMany: {
                            data: data.processBy.map((el) => ({ user_id: el })),
                            skipDuplicates: true,
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

            const myTodoMaped = {
                id: todoUpdateAssignees.id,
                status: todoUpdateAssignees.status,
                name: todoUpdateAssignees.name,
                createTime: todoUpdateAssignees.create_time,
                deadlineTime: todoUpdateAssignees.deadline_time,
                processBy: todoUpdateAssignees.assignees.map((el) => el.user),
                createBy: Object.values(todoUpdateAssignees.create_by).join(
                    '@'
                ),
            };

            return NextResponse.json({
                status: 'success',
                data: {
                    todoUpdated: myTodoMaped,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json({
                        status: 'fail',
                        message: 'You do not have permission',
                    });
            }
            console.log(error);
        }
    }

    return NextResponse.json({
        status: 'fail',
        message: 'No set field to update',
    });
};