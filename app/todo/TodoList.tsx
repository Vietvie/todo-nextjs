import Select, { SelectOption } from '@/components/Select';
import TodoState from '@/models/TodoState';
import { AppDispatch, useAppSelector } from '@/store';
import { todoAction } from '@/store/todoSlice';
import convertStatus from '@/utils/convertStatus';
import {
    faChevronCircleRight,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import EditTaskName from './EditTaskName';
import statusOptions from '@/dev-data/stauts';
import { UserOptions } from './page';
import todoApi from '@/services/todo';
import { TodoCustomForFE } from '@/interface';
import userTodoApi from '@/services/userTodoApi';
import { useRouter } from 'next/navigation';

type todoList = {
    list: TodoState[];
    onRemove: (id: number) => void;
    user: UserOptions[];
};

const TodoList: React.FC<todoList> = ({ list, onRemove, user }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [sortList, setSortList] = useState<
        {
            sortBy: 'createTime' | 'deadlineTime';
            sortType: 'asc' | 'desc';
        }[]
    >([
        {
            sortBy: 'createTime',
            sortType: 'asc',
        },
        {
            sortBy: 'deadlineTime',
            sortType: 'asc',
        },
    ]);
    const { userInfo } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const handleUpdateStatus = async (
        select: SelectOption | null,
        id?: number
    ) => {
        console.log(select);
        if (!id || !select) return;
        try {
            await todoApi.updateTodo(id, {
                status: select.value,
            });

            dispatch(
                todoAction.updateStatus({
                    id,
                    status: select.value,
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenEditTaskName = (id: number) => {
        dispatch(todoAction.openEditTaskName(id));
    };

    const handleOpenDatePicker = () => {
        dateInputRef.current?.showPicker();
    };

    const handleUpdateDeadline = async (newDeadline: string, id: number) => {
        console.log(newDeadline, id);
        try {
            await todoApi.changeDeadline(id, {
                deadlineTime: getUnixTime(new Date(newDeadline)),
            });
            dispatch(
                todoAction.updateDeadline({
                    id,
                    newDeadline: getUnixTime(new Date(newDeadline)),
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelect = async (select: SelectOption[], id?: number) => {
        if (id) {
            try {
                const { data } = await todoApi.updateAssigness(id, {
                    processBy: select.map((el) => el.value),
                });

                console.log(data.data.todoUpdated);
                const todoUpdated: TodoCustomForFE = data.data.todoUpdated;

                dispatch(
                    todoAction.setTodo(
                        list.map((el) => {
                            if (el.id === id)
                                return {
                                    ...todoUpdated,
                                    name: {
                                        value: todoUpdated.name,
                                        editing: false,
                                    },
                                    processBy: todoUpdated.processBy.map(
                                        (el) => ({
                                            value: el.id,
                                            label: el.name,
                                        })
                                    ),
                                };
                            return el;
                        })
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleRemoveAssignees = async (select: SelectOption, id: number) => {
        try {
            const { data } = await userTodoApi.deleteAssignedUser({
                user_id: select.value,
                todo_id: id,
            });

            console.log(data.type);

            if (data.type && data.type === 'notowner') {
                return dispatch(todoAction.removeTodo(id));
            }

            dispatch(
                todoAction.setTodo(
                    list.map((el) => {
                        if (el.id === id)
                            return {
                                ...el,
                                processBy: el.processBy.filter(
                                    (el2) => el2.value !== select.value
                                ),
                            };
                        return el;
                    })
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSort = (sortBy: 'createTime' | 'deadlineTime') => {
        dispatch(
            todoAction.sort({
                sortBy: sortBy,
                sortType: sortList.find((el) => el.sortBy === sortBy)?.sortType,
            })
        );
        setSortList((prev) =>
            prev.map((el) => {
                if (el.sortBy === sortBy) {
                    return {
                        ...el,
                        sortType: el.sortType === 'asc' ? 'desc' : 'asc',
                    };
                }
                return el;
            })
        );
    };

    const getTodoDetail = (id: string | number) => {
        return router.push(`/todo/${id}`);
    };

    return (
        <div className="h-full">
            <table className="w-full">
                <thead className="text-left sticky top-0 p-2 bg-zinc-100 z-20">
                    <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Task</th>
                        <th
                            onClick={() => toggleSort('createTime')}
                            className="p-2"
                        >
                            Ngày tạo
                        </th>
                        <th
                            onClick={() => toggleSort('deadlineTime')}
                            className="p-2"
                        >
                            Deadline
                        </th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2">Người tạo</th>
                        <th className="p-2">Người xử lý</th>
                        <th className=" text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((el, index) => (
                        <tr
                            key={index}
                            className="bg-white hover:bg-slate-200 rounded-lg"
                        >
                            <td className="p-2">{index + 1}</td>
                            <td
                                onClick={() => handleOpenEditTaskName(el.id)}
                                className="p-2"
                            >
                                <div className="relative">
                                    <span>{el.name.value}</span>
                                    {el.name.editing && (
                                        <EditTaskName
                                            id={el.id}
                                            taskName={el.name.value}
                                            currentTaskName={el.name.value}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="p-2">
                                {format(
                                    fromUnixTime(el.createTime),
                                    'dd/MM/yyyy'
                                )}
                            </td>
                            <td
                                className="p-2 relative"
                                onClick={handleOpenDatePicker}
                            >
                                <input
                                    disabled={
                                        !userInfo ||
                                        `${userInfo.id}` !==
                                            el.createBy.split('@')[0]
                                    }
                                    type="date"
                                    value={format(
                                        fromUnixTime(el.deadlineTime),
                                        'yyyy-MM-dd'
                                    )}
                                    onChange={(e) =>
                                        handleUpdateDeadline(
                                            e.target.value,
                                            el.id
                                        )
                                    }
                                />
                            </td>
                            <td className="p-2">
                                <Select
                                    titleStyle={convertStatus(el.status).style}
                                    id={el.id}
                                    options={statusOptions}
                                    value={{
                                        value: el.status,
                                        label: convertStatus(el.status).label,
                                    }}
                                    onSelect={handleUpdateStatus}
                                />
                            </td>
                            <td className="p-2">{el.createBy.split('@')[1]}</td>
                            <td className="p-2  cursor-pointer">
                                <Select
                                    id={el.id}
                                    options={user}
                                    value={el.processBy}
                                    multiple
                                    onSelect={handleSelect}
                                    onRemove={handleRemoveAssignees}
                                />
                            </td>
                            <td className="p-2 flex justify-center items-center">
                                <button
                                    disabled={
                                        !userInfo ||
                                        `${userInfo.id}` !==
                                            el.createBy.split('@')[0]
                                    }
                                    onClick={
                                        userInfo &&
                                        `${userInfo.id}` ===
                                            el.createBy.split('@')[0]
                                            ? () => onRemove(el.id)
                                            : () => {}
                                    }
                                    className="h-10 aspect-square hover:bg-slate-200 flex items-center justify-center disabled:text-gray-300"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                                <button
                                    onClick={() => getTodoDetail(el.id)}
                                    disabled={!userInfo}
                                    className="h-10 aspect-square hover:bg-slate-200 flex items-center justify-center disabled:text-gray-300"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronCircleRight}
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;
