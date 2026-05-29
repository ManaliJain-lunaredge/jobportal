"use client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useEffect, useState } from "react"
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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // helper: try to refresh access token using HttpOnly refresh cookie
  async function tryRefreshAccessToken() {
    try {
      const { data } = await axios.post(`${auth_service}/api/auth/refresh`, {}, { withCredentials: true });
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      return null;
    }
  }

  async function fetchUserWithToken(token: string) {
    try {
      const { data } = await axios.get(`${user_service}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.put(`${user_service}/api/user/update/profile-pic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("updated successfully");
      await fetchUserWithToken(token);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  async function updateResume(formData: FormData) {
    setLoading(true);
    console.log("my data", formData);

    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      await axios.put(`${user_service}/api/user/update/resume`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      toast.success("Updated successfully");
      await fetchUserWithToken(token);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  async function logOutUser() {
    try {
      await axios.post(`${auth_service}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      // ignore errors on logout
    }
    setAccessToken(null);
    setUser(null);
    setIsAuth(false);
    setLoading(false);
    toast.success("Logged out successfully");
  }

  async function updateProfile(payload: { name?: string; email?: string; phone_number?: string | number; bio?: string }) {
    if (!user) return;
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.post(`${user_service}/api/user/update/${user.user_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message || "Profile updated");
      // if backend returned the updated user, merge it into context immediately
      if (data && data.updatedUser) {
        setUser((prev) => ({ ...(prev as any), ...data.updatedUser }));
      } else {
        // fallback: re-fetch full user
        await fetchUserWithToken(token as string);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // on mount try refresh to obtain access token and fetch user
    (async () => {
      const token = await tryRefreshAccessToken();
      if (token) {
        await fetchUserWithToken(token);
      } else {
        setLoading(false);
        setIsAuth(false);
      }
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, loading, btnLoading, isAuth, accessToken, setUser, setLoading, setIsAuth, setAccessToken, logOutUser, updateProfilePic, updateResume, updateProfile }}
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