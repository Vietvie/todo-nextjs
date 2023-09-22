import Select, { SelectOption } from '@/components/Select';
import TodoState from '@/models/TodoState';
import { AppDispatch } from '@/store';
import { todoAction } from '@/store/todoSlice';
import convertStatus from '@/utils/convertStatus';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import EditTaskName from './EditTaskName';
import userList from '@/dev-data/user';
import convertUserName from '@/utils/covertUserName';
import statusOptions from '@/dev-data/stauts';

type todoList = {
    list: TodoState[];
    onRemove: (id: number) => void;
};

const TodoList: React.FC<todoList> = ({ list, onRemove }) => {
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
    const dateInputRef = useRef<HTMLInputElement>(null);
    const handleUpdateStatus = (select: SelectOption | null, id?: number) => {
        if (!id || !select) return;
        dispatch(
            todoAction.updateStatus({
                id,
                status: select.value,
            })
        );
    };

    const handleUpdateProcessUser = (
        select: { value: string; label: string } | null,
        id?: number
    ) => {
        if (!id || !select) return;
        dispatch(
            todoAction.updateProcessUser({
                id,
                newUserProcess: select.value,
            })
        );
    };

    const handleOpenEditTaskName = (id: number) => {
        dispatch(todoAction.openEditTaskName(id));
    };

    const handleOpenDatePicker = () => {
        dateInputRef.current?.showPicker();
    };

    const handleUpdateDeadline = (newDeadline: string, id: number) => {
        dispatch(
            todoAction.updateDeadline({
                id,
                newDeadline: new Date(newDeadline).getTime(),
            })
        );
    };

    const handleSort = (sortBy: 'createTime' | 'deadlineTime') => {
        dispatch(
            todoAction.sort({
                sortBy,
                sortType: sortList.find((el) => el.sortBy === sortBy)?.sortType,
            })
        );
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
    return (
        <div className="h-full">
            <table className="w-full">
                <thead className="text-left sticky top-0 p-2 bg-zinc-100 z-1">
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
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="p-2">
                                {format(el.createTime, 'dd/MM/yyyy')}
                            </td>
                            <td
                                className="p-2 relative"
                                onClick={handleOpenDatePicker}
                            >
                                <div className="relative">
                                    {format(el.deadlineTime, 'dd/MM/yyyy')}
                                    <input
                                        className="w-0 h-0 absolute top-full mt-1 left-0"
                                        type="date"
                                        ref={dateInputRef}
                                        onChange={(e) =>
                                            handleUpdateDeadline(
                                                e.target.value,
                                                el.id
                                            )
                                        }
                                    />
                                </div>
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
                            <td className="p-2">{el.createBy}</td>
                            <td className="p-2  cursor-pointer">
                                {/* <Select
                                    titleStyle="hover:text-white hover:bg-green-600 cursor-pointer"
                                    id={el.id}
                                    options={userList}
                                    value={null}
                                    onSelect={handleUpdateProcessUser}
                                /> */}
                                {el.processBy.map((el) => (
                                    <div>
                                        <span>{el.split('@')[1]}</span>
                                    </div>
                                ))}
                            </td>
                            <td className="p-2 flex justify-center">
                                <span
                                    onClick={() => onRemove(el.id)}
                                    className="h-10 aspect-square hover:bg-slate-200 flex items-center justify-center "
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;
