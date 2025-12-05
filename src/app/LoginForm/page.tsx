'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Layout from '../layout/page';
import Link from 'next/link';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState(''); // email or phone
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/auth/login', { 
                identifier, 
                password 
            });

            localStorage.setItem('token', response.data.token);

            if (response.data.role === 'admin') {
                router.push('/admin/Userlist');
            } else {
                router.push('/admin/Userlist');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Layout>
            <div className="h-[85vh] flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-7">
                        
                        <input 
                            type="text" 
                            placeholder="Enter Email or Phone"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700"
                        />

                        <input 
                            name="password" 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700" 
                        />

                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-2 px-4 rounded-md text-lg font-medium text-white bg-[#FA9609] hover:bg-[#ffaf3f] focus:outline-none"
                        > 
                            Login 
                        </button>

                        {error && <p className='text-[red] mt-5 text-center'>{error}</p>}

                        <p className="text-black text-center font-semibold">
                            Don't have an account? 
                            <span><Link className='mt-5 text-blue-700' href="/Signup"> Signup</Link></span>
                        </p>

                    </form>
                </div>
            </div>
        </Layout>
    );
}
