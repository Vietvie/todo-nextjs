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
import userApi from '@/services/user';
import convertUserToSelectOption from '@/utils/convertUserToSelectOption';
import { getUserInfoByToken } from '@/store/authSlice';
import authApi from '@/services/auth';
import { useRouter } from 'next/navigation';
import Paginantion from './Paginantion';

export type UserOptions = {
    value: number | string;
    label: string;
};

export type PageInfo = {
    pageNum: number;
    limit: number;
};

function Todo() {
    const router = useRouter();
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
    const [page, setPage] = useState<PageInfo>({
        pageNum: 1,
        limit: 2,
    });

    const [totalPage, setTotalPage] = useState(0);
    const [openAdd, setOpenAdd] = useState(false);
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

    const handleRemove = async (id: number) => {
        try {
            await todoApi.deleteTodo(id);
            dispatch(todoAction.removeTodo(id));
        } catch (error) {
            console.log(error);
        }
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

    const filter = useAppSelector((state) => state.filter);
    const handleLogout = async () => {
        try {
            await authApi.logout();
            return router.push('/auth/login');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchMyTodo = async () => {
            try {
                const queryObj: { [key: string]: any } = {};
                if (filter.status) queryObj.status = filter.status;
                if (filter.task) queryObj[`name[contains]`] = filter.task;
                queryObj.limit = page.limit;
                queryObj.page = page.pageNum;

                const { data } = await todoApi.myTodo(queryObj);
                const myTodo = data.data.myTodoMaped.map(
                    (el: TodoCustomForFE) => ({
                        ...el,
                        name: { value: el.name, editing: false },
                        processBy: el.processBy.map((el) => ({
                            value: el.id,
                            label: el.name,
                        })),
                    })
                );
                dispatch(todoAction.setTodo(myTodo));
                setTotalPage(data.allTodo);
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

        dispatch(getUserInfoByToken());
        fetchUser();
        fetchMyTodo();
    }, [filter, page]);

    const toggleAdd = () => {
        setOpenAdd((prev) => !prev);
    };
    return (
        <div className="h-screen flex text-black bg-zinc-100 flex-col items-center ">
            <div className=" flex justify-end w-full px-4 py-2">
                <button
                    onClick={handleLogout}
                    className="p-2 bg-black text-white rounded-lg"
                >
                    Logout
                </button>
            </div>
            <div className="w-full px-8 py-2 flex flex-col gap-4 h-full overflow-auto">
                <h1 className="text-black font-semibold text-xl">Todo app</h1>
                <div className="flex justify-end">
                    <button
                        onClick={toggleAdd}
                        className="px-4 py-2 bg-green-600 text-white"
                    >
                        New todo
                    </button>
                </div>
                {openAdd && (
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
                                    zIndex={50}
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
                )}
                <Search onChange={setPage} />
                <div className="flex-1 overflow-auto">
                    <TodoList
                        user={user}
                        list={todoList}
                        onRemove={handleRemove}
                    />
                </div>
            </div>
            <Paginantion
                page={page.pageNum}
                limit={page.limit}
                total={totalPage}
                onChange={setPage}
            />
        </div>
    );
}

export default Todo;
