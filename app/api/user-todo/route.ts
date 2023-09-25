import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface dataType {
    user_id: number;
    todo_id: number;
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

    const data: dataType = await req.json();
    const currentTodo = await prisma.todo.findUnique({
        where: {
            id: data.todo_id,
        },
    });

    console.log(currentTodo?.create_by_id, tokenDecoded.id);

    if (currentTodo?.create_by_id !== tokenDecoded.id)
        return NextResponse.json({
            statue: 'fail',
            message: `you not is owner of todo #${data.todo_id}`,
        });

    const newUserAssigned = await prisma.userTodo.create({
        data: {
            todo_id: data.todo_id,
            user_id: data.user_id,
        },
    });
    return NextResponse.json(newUserAssigned);
};

export const PATCH = async (req: NextRequest) => {
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

    const data: dataType = await req.json();
    const currentTodo = await prisma.todo.findUnique({
        where: {
            id: data.todo_id,
        },
        include: {
            assignees: true,
        },
    });

    if (
        currentTodo?.create_by_id !== tokenDecoded.id &&
        !currentTodo?.assignees
            .map((el) => el.user_id)
            .includes(tokenDecoded.id)
    )
        return NextResponse.json(
            {
                statue: 'fail',
                message: `you not is owner of todo #${data.todo_id}`,
            },
            {
                status: 400,
            }
        );

    if (data.user_id === tokenDecoded.id) {
        await prisma.userTodo.delete({
            where: {
                user_id_todo_id: {
                    todo_id: data.todo_id,
                    user_id: data.user_id,
                },
            },
        });
        return NextResponse.json({
            status: 'success',
            type: 'notowner',
        });
    } else if (currentTodo.create_by_id === tokenDecoded.id) {
        const userTodoDeleted = await prisma.userTodo.delete({
            where: {
                user_id_todo_id: {
                    todo_id: data.todo_id,
                    user_id: data.user_id,
                },
            },
        });

        return NextResponse.json({
            status: 'success',
            userTodoDeleted,
        });
    }

    return NextResponse.json(
        {
            status: 'fail',
            message: 'some thing went wrong',
        },
        {
            status: 404,
        }
    );
};
