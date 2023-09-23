import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
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

    const todoByUser = await prisma.todo.findFirst({
        where: {
            id,
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

    // if (!todoByUser) {
    //     return NextResponse.redirect(new URL('/todo', req.url));
    // }

    if (!todoByUser) {
        return NextResponse.json(
            {
                status: 'fail',
                message: 'You do not have permission to access this todo',
            },
            {
                status: 400,
            }
        );
    }

    return NextResponse.json({
        status: 'success',
        data: {
            todo: todoByUser,
        },
    });
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
        return NextResponse.json(
            {
                status: 'fail',
                message: `You are not the owner of todo ${id}`,
            },
            {
                status: 400,
            }
        );

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
        | {
              status?: string;
              deadlineTime?: number;
              processBy?: number[];
              taskName?: string;
          }
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

            return NextResponse.json({
                status: 'success',
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json(
                        {
                            status: 'fail',
                            message: 'You do not have permission',
                        },
                        {
                            status: 400,
                        }
                    );
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

            return NextResponse.json({
                status: 'success',
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json(
                        {
                            status: 'fail',
                            message: 'You do not have permission',
                        },
                        {
                            status: 400,
                        }
                    );
            }
            console.log(error);
        }
    }

    //update Task name By Owner
    if (data?.taskName) {
        try {
            const todoUpdateDeadline = await prisma.todo.update({
                where: {
                    id,
                    create_by_id: tokenDecoded.id,
                },
                data: {
                    name: data.taskName,
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

            return NextResponse.json({
                status: 'success',
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    return NextResponse.json(
                        {
                            status: 'fail',
                            message: 'You do not have permission',
                        },
                        {
                            status: 400,
                        }
                    );
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
                    return NextResponse.json(
                        {
                            status: 'fail',
                            message: 'You do not have permission',
                        },
                        {
                            status: 400,
                        }
                    );
            }
            console.log(error);
        }
    }

    return NextResponse.json({
        status: 'fail',
        message: 'No set field to update',
    });
};
