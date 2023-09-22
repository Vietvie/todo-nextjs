import { AppDispatch } from '@/store';
import { todoAction } from '@/store/todoSlice';
import React, { FC, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const EditTaskName: FC<{ id: number; taskName: string }> = ({
    id,
    taskName,
}) => {
    const [newTask, setNewTask] = useState(taskName);
    const dispatch = useDispatch<AppDispatch>();

    const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
        setNewTask(e.currentTarget.value);
    };

    const updateNewTaskName = () => {
        dispatch(todoAction.updateTaskName({ id, newTaskName: newTask }));
    };
    return (
        <div className="absolute top-0 h-full w-full z-10">
            <input
                autoFocus={true}
                onBlur={updateNewTaskName}
                value={newTask}
                onChange={handleOnChange}
                type="text"
                className="h-full w-full bg-white"
            />
        </div>
    );
};

export default EditTaskName;
