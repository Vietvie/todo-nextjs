'use client';
import authApi from '@/services/auth';
import React, { FormEvent, useState } from 'react';

const Sigup = () => {
    const [formInput, setFormInput] = useState<{
        email: string;
        password: string;
        name: string;
    }>({
        email: '',
        password: '',
        name: '',
    });

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setFormInput((prev) => ({ ...prev, [name]: value }));
    };

    const hanldeSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await authApi.signup(formInput);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-zinc-100 h-screen flex flex-col justify-center items-center">
            <form onSubmit={hanldeSubmit} className="flex flex-col gap-2  ">
                <h1 className="text-black">Sign Up</h1>
                <input
                    name="name"
                    onChange={handleInput}
                    className="p-3 bg-slate-200 rounded-lg border shadow-sm caret-black text-black"
                    type="text"
                    placeholder="your name"
                />
                <input
                    name="email"
                    onChange={handleInput}
                    className="p-3 bg-slate-200 rounded-lg border shadow-sm caret-black text-black"
                    type="text"
                    placeholder="email"
                />
                <input
                    name="password"
                    onChange={handleInput}
                    className="p-3 bg-slate-200 rounded-lg border shadow-sm caret-black text-black"
                    type="text"
                    placeholder="password"
                />
                <button type="submit" className="bg-green-600 p-3 rounded-lg">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Sigup;
