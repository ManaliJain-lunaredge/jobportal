"use client"
import React, { FormEvent, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!email) {
      toast.error('Please enter your email')
      setLoading(false)
      return
    }
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email })
      toast.success(data?.message || 'If that email exists, we sent a reset link')
      setEmail('')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to request reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Forgot your password?</h1>
          <p className='text-sm opacity-70'>Enter your email and we'll send a reset link</p>
        </div>
        <div className='border border-gray-400 rounded-xl p-8 shadow-lg backdrop-blur-sm'>
          <form onSubmit={submitHandler} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm font-medium'>Email Address</Label>
              <Input id='email' name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='you@company.com' />
            </div>

            <div>
              <Button type='submit' className='w-full' disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
