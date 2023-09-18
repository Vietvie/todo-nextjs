import Select from '@/components/Select';
import TodoState from '@/models/TodoState';
import { AppDispatch } from '@/store';
import { todoAction } from '@/store/todoSlice';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
        if (!id) return;
        dispatch(
            todoAction.updateStatus({
                id,
                status: select.value,
            })
        );
    };

    return (
        <div>
            <div>
                <table className="w-full">
                    <thead className="text-left">
                        <tr>
                            <th>Task</th>
                            <th>Ngày tạo</th>
                            <th>Deadline</th>
                            <th>Trạng thái</th>
                            <th>Người tạo</th>
                            <th>Ngày tạo</th>
                            <th className=" text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((el, index) => (
                            <tr key={index}>
                                <td>{el.name}</td>
                                <td>{format(el.creatTime, 'dd/MM/yyyy')}</td>
                                <td>{format(el.deadlineTime, 'dd/MM/yyyy')}</td>
                                <td>
                                    <Select
                                        options={statusOptions}
                                        value={{
                                            value: el.status,
                                            label: 'pending',
                                        }}
                                        onSelect={handleUpdateStatus}
                                    />
                                </td>
                                <td>{el.createBy}</td>
                                <td>{el.processBy}</td>
                                <td className="flex justify-center">
                                    <span
                                        onClick={() => onRemove(el.id)}
                                        className="h-10 aspect-square hover:bg-slate-200 flex items-center justify-center "
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodoList;
