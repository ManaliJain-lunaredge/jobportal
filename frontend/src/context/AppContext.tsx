"use client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
export const utils_service = "http://localhost:5001"

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const auth_service = "http://localhost:5000"
export const user_service = "http://localhost:5002"
export const job_service = "http://localhost:5003"

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const token = Cookies.get("token")

  async function fetchUser() {
    try {
      const { data } = await axios.get(
        `${user_service}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("error fetching user ", error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }
  async function updateProfilePic(formData: any) {

    setLoading(true)
    try {
      const { data } = await axios.put(`${user_service}/api/user/update/profile-pic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      })

      toast.success("updated successfully")
      fetchUser()
    }
    catch (error: any) {
      toast.error(error.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }

  async function updateResume(formData: FormData) {
    setLoading(true);
    console.log("my data", formData);

    try {
      await axios.put(
        `${user_service}/api/user/update/resume`,
        formData,
        {
         headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "multipart/form-data",
},
        }
      );

      toast.success("Updated successfully");
      fetchUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  async function logOutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

  async function updateProfile(payload: { name?: string; email?: string; phone_number?: string | number; bio?: string }) {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${user_service}/api/user/update/${user.user_id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Profile updated");
      // if backend returned the updated user, merge it into context immediately
      if (data && data.updatedUser) {
        setUser((prev) => ({ ...(prev as any), ...data.updatedUser }));
      } else {
        // fallback: re-fetch full user
        await fetchUser();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false);
    }
  }, [token])

  return (
    <AppContext.Provider
      value={{ user, loading, btnLoading, isAuth, setUser, setLoading, setIsAuth, logOutUser, updateProfilePic, updateResume, updateProfile }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};
export const useAppData = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppData must beused in app provider ")
  }
  return context
}