'use client';
import todoApi from '@/services/todo';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, fromUnixTime } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface TodoDetails {
    name: string;
    create_time: number;
    deadline_time: number;
    create_by_id: number;
    status: string;
}

const TodoDetails = ({ params }: { params: { id: string } }) => {
    const [todo, setTodo] = useState<TodoDetails | undefined>();
    const router = useRouter();
    useEffect(() => {
        const fetchTodoDetail = async (id: number | string) => {
            try {
                const { data } = await todoApi.getTodoDetail(params.id);

                setTodo(data.data.todo);
            } catch (error) {
                console.log(error);
                router.push('/todo');
            }
        };
        fetchTodoDetail(params.id);
    }, []);

    return (
        <div className="bg-zinc-100 h-screen flex flex-col justify-center items-center text-black">
            <Link
                href={'/todo'}
                className="w-20 flex justify-center items-center aspect-square hover:bg-green-600 hover:text-white rounded-full"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
            {todo && (
                <ul className="flex  flex-col items-center justify-between w-full p-10 gap-4">
                    <li>{todo.name}</li>
                    <li>{`Ngay tao: ${format(
                        fromUnixTime(todo.create_time),
                        'dd-MM-yyyy'
                    )}`}</li>
                    <li>{`Ngay tao: ${format(
                        fromUnixTime(todo.deadline_time),
                        'dd-MM-yyyy'
                    )}`}</li>
                    <li>{`Trang thai: ${todo.status}`}</li>
                    <li>{todo.create_by_id}</li>
                </ul>
            )}
        </div>
    );
};

export default TodoDetails;
