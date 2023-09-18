'use client';
import React, { FormEvent, useRef, useState, KeyboardEvent } from 'react';
import TodoList from './TodoList';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/store';
import { todoAction } from '@/store/todoSlice';
import TodoState from '@/models/TodoState';
import Select from '@/components/Select';

function Todo() {
    const options = [
        {
            value: 'viet',
            label: 'Viet Nguyen',
        },
        {
            value: 'dao',
            label: 'Dao',
        },
        {
            value: 'dong',
            label: 'Dong',
        },
    ];
    const [todo, setTodo] = useState('');
    const [selected, setSelected] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const todoList = useAppSelector((state) => state.todo);
    const dispatch = useDispatch<AppDispatch>();
    const inputRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const value = setTodo(e.currentTarget.value.trim());
    };

    console.log(todoList);

    const handleAddTodo = () => {
        if (todo && date && selected) {
            dispatch(
                todoAction.addTodo(
                    new TodoState(
                        todo,
                        new Date(date).getTime(),
                        'pending',
                        'Viet', // Default hardcode
                        selected.label
                    )
                )
            );
            setTodo('');
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

    const handleSelect = (select: { value: string; label: string }) => {
        setSelected(select);
    };

    const handleOpenDatePicker = () => {
        dateRef.current?.showPicker();
    };

    const handlePickDate = (e: FormEvent<HTMLInputElement>) => {
        setDate(e.currentTarget.value);
    };
    return (
        <div className="h-screen flex text-black bg-zinc-100 flex-col justify-center items-center ">
            <div className="w-full p-8 flex flex-col gap-8">
                <h1 className="text-black">Todo app</h1>
                <div className="flex gap-2 items-center bg-white rounded-lg shadow-md ">
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
                        <div onClick={handleOpenDatePicker}>
                            <span>{date || 'Deadline'}</span>
                            <input
                                type="date"
                                placeholder="Deadline"
                                ref={dateRef}
                                hidden
                                onChange={handlePickDate}
                            />
                        </div>
                        <div className="h-full w-40">
                            <Select
                                value={selected}
                                options={options}
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
                <TodoList list={todoList} onRemove={handleRemove} />
            </div>
        </div>
    );
}

export default Todo;