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
  const [companies, setCompanies] = useState<any[]>([]);

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
      // if recruiter, fetch their companies using the same token
      try {
        if (data?.role === "recruiter") {
          await fetchCompanies(token);
        }
      } catch (err) {
        console.error("failed to fetch companies after user fetch", err);
      }
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
  async function addSkill(skillName: string) {
    if (!user) return;
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.post(`${user_service}/api/user/skill/add`, { skillName }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message || "Skill added");
      // optimistic update: append skill to user.skills
      setUser((prev) => prev ? ({ ...(prev as any), skills: [...(prev.skills || []), skillName] }) : prev);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompanies(passedToken?: string) {
    // if token provided use it (callers like fetchUserWithToken will pass it), else try to obtain
    setLoading(true);
    try {
      let token = passedToken || accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.get(`${job_service}/api/job/all-compaines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(data.companies || data || []);
    } catch (error: any) {
      // provide richer diagnostics for browser network/CORS/auth issues
      if (error?.response) {
        console.error("failed to fetch companies - response:", { status: error.response.status, data: error.response.data });
        toast.error(`Failed to fetch companies: ${error.response.status} ${error.response.data?.message || ''}`);
      } else if (error?.request) {
        console.error("failed to fetch companies - no response received, request:", error.request);
        toast.error("Network Error while fetching companies (no response). Check job service and CORS settings.");
        // try a plain fetch to surface CORS errors with a clearer message
        try {
          if (typeof window !== 'undefined') {
            const ping = await fetch(`${job_service}/api/job/all-compaines`, { method: 'OPTIONS' });
            console.log('OPTIONS ping result', ping.status, await ping.text().catch(() => null));
          }
        } catch (ferr) {
          console.error('fetch fallback failed', ferr);
        }
      } else {
        console.error("failed to fetch companies", error);
        toast.error(error?.message || "Failed to fetch companies");
      }
    } finally {
      setLoading(false);
    }
  }

  async function createCompany(formData: FormData) {
    if (!user) return;
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.post(`${job_service}/api/job/create-company`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message || "Company created");
      // optimistic: append
      setCompanies((prev) => [...(prev || []), data.newCompany || data.company || {}]);
    } catch (error: any) {
      console.log("Axios Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      if (error.request) {
        console.log("Request:", error.request);
      }

      console.log("Message:", error.message);
    }
    finally {
      setLoading(false);
    }
  }

  async function deleteCompany(companyId: number) {
    if (!user) return;
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.delete(`${job_service}/api/job/delete-company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message || "Company deleted");
      setCompanies((prev) => (prev || []).filter((c: any) => c.company_id !== companyId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete company");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSkill(skillName: string) {
    if (!user) return;
    setLoading(true);
    try {
      let token = accessToken;
      if (!token) token = await tryRefreshAccessToken();
      if (!token) throw new Error("Not authenticated");

      const { data } = await axios.delete(`${user_service}/api/user/skill/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { skillName },
      });

      toast.success(data.message || "Skill removed");
      // optimistic update: remove skill from user.skills
      setUser((prev) => prev ? ({ ...(prev as any), skills: (prev.skills || []).filter((s: string) => s !== skillName) }) : prev);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete skill");
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
        // if current user is recruiter, fetch their companies
        if ((user as any)?.role === "recruiter") await fetchCompanies();
      } else {
        setLoading(false);
        setIsAuth(false);
      }
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, loading, btnLoading, isAuth, accessToken, companies, setUser, setLoading, setIsAuth, setAccessToken, logOutUser, updateProfilePic, updateResume, updateProfile, addSkill, deleteSkill, fetchCompanies, createCompany, deleteCompany }}
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