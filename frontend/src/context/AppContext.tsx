"use client"
import {Toaster} from "react-hot-toast"
import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useState } from "react"
export const utils_service = "http://localhost:5001"

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const auth_service="http://localhost:5000"
export const user_service="http://localhost:5002"
export const job_service="http://localhost:5003"
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{ user, loading, btnLoading, isAuth, setUser, setLoading, setIsAuth }}
    >
      {children}
      <Toaster/>
    </AppContext.Provider>
  );
};
export const useAppData=():AppContextType=>{
    const context=useContext(AppContext)
    if(!context){
        throw new Error("useAppData must beused in app provider ")
    }
    return context
}