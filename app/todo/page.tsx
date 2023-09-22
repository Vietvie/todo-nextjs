'use client';
import React, {
    FormEvent,
    useRef,
    useState,
    KeyboardEvent,
    useEffect,
} from 'react';
import TodoList from './TodoList';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/store';
import { todoAction } from '@/store/todoSlice';
import Select, { SelectOption } from '@/components/Select';
import Search from './Search';
import todoApi from '@/services/todo';
import { getUnixTime } from 'date-fns';
import { TodoCustomForFE } from '@/interface';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import userApi from '@/services/user';
import convertUserToSelectOption from '@/utils/convertUserToSelectOption';

export type UserOptions = {
    value: number | string;
    label: string;
};

function Todo() {
    const [todo, setTodo] = useState('');
    const [user, setUser] = useState<UserOptions[]>([]);
    const [selected, setSelected] = useState<SelectOption[]>([]);
    const [date, setDate] = useState<string | null>(null);
    const todoList = useAppSelector((state) => state.todo);
    const dispatch = useDispatch<AppDispatch>();
    const inputRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        setTodo(e.currentTarget.value);
    };

    const handleAddTodo = async () => {
        if (todo && date && selected) {
            const { data } = await todoApi.addNewTodo({
                create_time: getUnixTime(Date.now()),
                deadline_time: getUnixTime(new Date(date)),
                name: todo,
                process_by_id: selected.map((el) => el.value),
            });

            const newTodo: TodoCustomForFE = data.data.todo;

            dispatch(
                todoAction.addTodo({
                    ...newTodo,
                    name: { value: newTodo.name, editing: false },
                    processBy: newTodo.processBy.map((el) => ({
                        value: el.id,
                        label: el.name,
                    })),
                })
            );
            setTodo('');
            setDate(null);
            setSelected([]);
            inputRef.current?.focus();
        }
    };

    const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleRemove = (id: number) => {
        dispatch(todoAction.removeTodo(id));
    };

    const handleSelect = (select: SelectOption[]) => {
        setSelected(select);
    };

    const handleOpenDatePicker = () => {
        dateRef.current?.showPicker();
    };

    const handlePickDate = (e: FormEvent<HTMLInputElement>) => {
        setDate(e.currentTarget.value);
    };

    useEffect(() => {
        const fetchMyTodo = async () => {
            try {
                const { data } = await todoApi.myTodo();
                console.log(data.data.myTodoMaped);
                const myTodo = data.data.myTodoMaped.map(
                    (el: TodoCustomForFE) => ({
                        ...el,
                        name: { value: el.name, editing: faSleigh },
                        processBy: el.processBy.map((el) => ({
                            value: el.id,
                            label: el.name,
                        })),
                    })
                );
                dispatch(todoAction.setTodo(myTodo));
            } catch (error) {
                console.log(error);
            }
        };

        const fetchUser = async () => {
            try {
                const { data } = await userApi.getAllUser();
                const allUser: UserOptions[] = convertUserToSelectOption(
                    data.data.allUser
                );
                setUser(allUser);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
        fetchMyTodo();
    }, []);
    return (
        <div className="h-screen flex text-black bg-zinc-100 flex-col items-center ">
            <div className="w-full p-8 flex flex-col gap-8 h-full overflow-auto">
                <h1 className="text-black font-semibold text-2xl">Todo app</h1>
                <div className="flex gap-2 items-center bg-white rounded-lg shadow-md">
                    <input
                        onKeyDown={handleEnter}
                        ref={inputRef}
                        onChange={handleInput}
                        value={todo}
                        type="text"
                        className="h-full p-3 rounded-sm w-full text-black outline-none"
                        placeholder="Your todo"
                    />
                    <div className=" flex h-full justify-center items-center gap-2 whitespace-nowrap">
                        <div
                            onClick={handleOpenDatePicker}
                            className="relative"
                        >
                            <span>{date || 'Deadline'}</span>
                            <input
                                className="w-0 h-0 absolute top-full mt-1 left-0"
                                type="date"
                                placeholder="Deadline"
                                ref={dateRef}
                                onChange={handlePickDate}
                            />
                        </div>
                        <div className="h-full w-40">
                            <Select
                                multiple
                                value={selected}
                                options={user}
                                placehodler="Người xử lý"
                                onSelect={handleSelect}
                            />
                        </div>
                    </div>
                    <div></div>
                    <button
                        onClick={handleAddTodo}
                        className="h-full aspect-square bg-green-500 "
                    >
                        Add
                    </button>
                </div>
                <Search />
                <div className="flex-1 overflow-auto">
                    <TodoList
                        user={user}
                        list={todoList}
                        onRemove={handleRemove}
                    />
                </div>
            </div>
        </div>
    );
}

export default Todo;
