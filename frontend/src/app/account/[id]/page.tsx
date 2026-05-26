"use client"

import { User } from '@/type'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { user_service } from '@/context/AppContext'
import Cookies from 'js-cookie'
import { useParams } from 'next/navigation'
import Loading from '@/components/loading'
import Info from '../(components)/info'

const UserAccount = () => {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()
  const id = params?.id as string

  async function fetchUser() {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${user_service}/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(data);

    } catch (error) {
      console.log("Error fetching user", error);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <Loading />

  return (
    <>
      {
        user && (
          <div>
            <div className="w-[90%] md:w-[60%] m-auto">
              <Info user={user} isYourAccount={false} />
            </div>
          </div>
        )
      }
    </>
  )
}

export default UserAccount