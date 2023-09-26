import todoApi from '@/services/todo';
import { AppDispatch } from '@/store';
import { todoAction } from '@/store/todoSlice';
import React, { FC, FormEvent, KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const EditTaskName: FC<{
    id: number;
    taskName: string;
    currentTaskName: string;
}> = ({ id, taskName, currentTaskName }) => {
    const [newTask, setNewTask] = useState(taskName);
    const dispatch = useDispatch<AppDispatch>();

    const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
        setNewTask(e.currentTarget.value);
    };

    const updateNewTaskName = async (currentTaskName: string) => {
        try {
            await todoApi.updateTodo(id, {
                taskName: newTask,
            });
            dispatch(todoAction.updateTaskName({ id, newTaskName: newTask }));
        } catch (error) {
            console.log(error);
            dispatch(
                todoAction.updateTaskName({ id, newTaskName: currentTaskName })
            );
        }
    };

    const handlerEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        updateNewTaskName(currentTaskName);
    };
    return (
        <div className="absolute top-0 h-full w-full z-10">
            <input
                onKeyDown={handlerEnter}
                autoFocus={true}
                onBlur={() => updateNewTaskName(currentTaskName)}
                value={newTask}
                onChange={handleOnChange}
                type="text"
                className="h-full w-full bg-white"
            />
        </div>
    );
};

export default EditTaskName;
