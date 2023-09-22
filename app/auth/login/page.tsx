'use client';
import authApi from '@/services/auth';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [formInput, setFormInput] = useState<{
        email: string;
        password: string;
    }>({
        email: '',
        password: '',
    });

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setFormInput((prev) => ({ ...prev, [name]: value }));
    };

    const hanldeSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await authApi.login(formInput);
            console.log(data);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return router.push('/todo');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-zinc-100 h-screen flex flex-col justify-center items-center">
            <form onSubmit={hanldeSubmit} className="flex flex-col gap-2  ">
                <h1 className="text-black">Login</h1>
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

export default Login;
