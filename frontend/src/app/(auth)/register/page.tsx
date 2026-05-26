"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [btnLoading, setBtnLoading] = useState(false);
  const { isAuth, setUser, setIsAuth, loading } = useAppData();
  if (loading) return <Loading />;
  if (isAuth) return redirect("/");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !role ||
      (role === "jobseeker" && !bio) ||
      (role === "jobseeker" && !resume)
    ) {
      toast.error("All fields are required");
      setBtnLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("role", role);

      if (role === "jobseeker") {
        formData.append("bio", bio);
        formData.append("resume", resume!);
      }

      const { data } = await axios.post(
        `${auth_service}/api/auth/register`,
        formData,
      );
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      setUser(data.registerUser);
      setIsAuth(true);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to register";
      toast.error(msg);
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Join HireHeaven</h1>
          <p className="text-sm opacity-70">
            Create an account to start your journey
          </p>
        </div>
        <div className="border border-gray-400 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                I want to{" "}
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-11 pr-4 pl-10 border-2 border-gray-300 rounded-md bg-transparent"
                required
              >
                <option value="">Select role</option>
                <option value="jobseeker">Find a Job</option>
                <option value="recruiter">Hire a Talent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="border-2 h-11 border-gray-300 rounded-md bg-transparent"
              />
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="border-2 h-11 border-gray-300 rounded-md bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="border-2 h-11 border-gray-300 rounded-md bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9898989898"
                className="border-2 h-11 border-gray-300 rounded-md bg-transparent"
              />
            </div>
{
  role === "jobseeker" && (
    <div>
      <Label htmlFor="resume" className="text-sm font-medium">
        Resume (PDF)
      </Label>

      <Input
        id="resume"
        name="resume"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
          }
        }}
        className="h-11 cursor-pointer"
      />
    </div>
  )
}

          <div className="space-y-2">
  <Label htmlFor="bio" className="text-sm font-medium">
    Bio
  </Label>

  <Input
    id="bio"
    type="text"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Tell us about yourself"
    className="border-2 h-11 border-gray-300 rounded-md bg-transparent"
  />
</div>

<div></div>

            <div>
              <Button type="submit" className="w-full" disabled={btnLoading}>
                {btnLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>

            <div className="text-center text-sm mt-3">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
