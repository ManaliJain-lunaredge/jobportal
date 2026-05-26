
"use client"
import React from 'react'
import { useAppData } from '@/context/AppContext'
import Info from './(components)/info'
import Loading from '@/components/loading'
const Accountpage = () => {
    const {user,isAuth,loading,}=useAppData()
    if(loading) return  <Loading/>
  return (
    <>
    
    {
        user&& (<div>
        <div className="w-[90%] md:w-[60%] m-auto">
           <Info user={user} isYourAccount={true}/>
        </div>
    </div>)
}</>
  )
}

export default Accountpage