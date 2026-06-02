"use client"
import React, { FormEvent, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

const ResetPasswordPage = () => {
  const params = useParams()
  const token = (params as any)?.token
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!password || !confirm) {
      toast.error('Please fill both fields')
      setLoading(false)
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password })
      toast.success(data?.message || 'Password reset successful')
      router.push('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Reset password</h1>
          <p className='text-sm opacity-70'>Enter a new password to continue</p>
        </div>
        <div className='border border-gray-400 rounded-xl p-8 shadow-lg backdrop-blur-sm'>
          <form onSubmit={submitHandler} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm font-medium'>New Password</Label>
              <Input id='password' name='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='New password' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm' className='text-sm font-medium'>Confirm Password</Label>
              <Input id='confirm' name='confirm' type='password' value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='Confirm password' />
            </div>

            <div>
              <Button type='submit' className='w-full' disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
