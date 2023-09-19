import Select from '@/components/Select';
import TodoState from '@/models/TodoState';
import { AppDispatch } from '@/store';
import { todoAction } from '@/store/todoSlice';
import convertStatus from '@/utils/convertStatus';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React from 'react';
import { useDispatch } from 'react-redux';

type todoList = {
    list: TodoState[];
    onRemove: (id: number) => void;
};

const TodoList: React.FC<todoList> = ({ list, onRemove }) => {
    const dispatch = useDispatch<AppDispatch>();
    const statusOptions = [
        {
            value: 'pending',
            label: 'Đang xử lý',
        },
        {
            value: 'completed',
            label: 'Đã hoàn thành',
        },
        {
            value: 'cancelled',
            label: 'Đã huỷ',
        },
    ];

    const handleUpdateStatus = (
        select: { value: string; label: string },
        id?: number
    ) => {
        console.log(id, select);
        if (!id) return;
        dispatch(
            todoAction.updateStatus({
                id,
                status: select.value,
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
                        <th className="p-2">Ngày tạo</th>
                        <th className="p-2">Deadline</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2">Người tạo</th>
                        <th className="p-2">Ngày xử lý</th>
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
                            <td className="p-2">{el.name}</td>
                            <td className="p-2">
                                {format(el.createTime, 'dd/MM/yyyy')}
                            </td>
                            <td className="p-2">
                                {format(el.deadlineTime, 'dd/MM/yyyy')}
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
                            <td className="p-2">{el.processBy}</td>
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
