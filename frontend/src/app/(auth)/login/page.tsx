
"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const { isAuth, setUser, loading, setIsAuth } = useAppData()
    if (isAuth) return redirect("/")
        if(loading) return <Loading/>
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true)

        if (!email || !password) {
            toast.error("Please enter email and password")
            setBtnLoading(false)
            return
        }

        try {
            const { data } = await axios.post(`${auth_service}/api/auth/login`, { email, password });
            toast.success(data.message)
            Cookies.set("token", data.token, {
                expires: 15,
                secure: false,
                path: "/"
            })
            setUser(data.userObject)
            setIsAuth(true)
        }
        catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Failed to sign in";
            toast.error(msg);
            setIsAuth(false);
        }
        finally {
            setBtnLoading(false)
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12'>

            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold mb-2'>Welcome back to HireHeaven </h1>
                    <p className='text-sm opacity-70'>Sign into continue your journey</p>
                </div>
                <div className='border border-gray-400 rounded-xl p-8 shadow-lg backdrop-blur-sm'>
                    <form onSubmit={submitHandler} className='space-y-5'>
                        <div className='space-y-2'>
                            <Label htmlFor="email" className='text-sm font-medium'>Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="password" className='text-sm font-medium'>Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
                            <div className='text-right'>
                                <Link href="/forgot-password" className='text-sm text-blue-600 hover:underline'>Forgot password?</Link>
                            </div>
                        </div>
                        <div>
                            <Button type='submit' className='w-full' disabled={btnLoading}>{btnLoading ? 'Signing in...' : 'Sign in'}</Button>
                        </div>

                        <div className='text-center text-sm mt-3'>
                            Don't have an account? <Link href="/register" className='text-blue-600 hover:underline'>Create one</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
