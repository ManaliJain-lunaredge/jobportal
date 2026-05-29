"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { AccountProps } from "@/type";
import { Card } from "@/components/ui/card";
import user_image from "../../../assets/user_image.png";
import Image from "next/image";
import { Briefcase, FileText, NotepadText, Mail, Phone, CameraIcon, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { utils_service } from "@/context/AppContext";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const editRef = useRef<HTMLInputElement | null>(null)
  const resumeRef = useRef<HTMLInputElement | null>(null)


  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bio, setBio] = useState("")
  const { updateProfilePic, updateResume, updateProfile } = useAppData()


  const handleClick = () => {
    inputRef.current?.click();

  }

  const changehandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData)
    }

  }

  const handleEditClick = () => {
    editRef.current?.click();
    setName(user.name);
    setPhoneNumber(String(user.phone_number))
    setBio(user.bio || "")
  }


  const updateHandleProfile = () => {

  }
  const handleResumeClick = () => {
    resumeRef.current?.click()
  }
 const changeResume = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Please upload PDF file");
    return;
  }

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = async () => {
    try {
      const base64 = reader.result;

      console.log(base64); // should start with data:application/pdf;base64,

      const { data } = await axios.post(
        `${utils_service}/upload`,
        {
          buffer: base64,
        }
      );

      console.log(data);

      // save URL in your backend/profile
      await updateResume({
        resume: data.url,
        public_id: data.public_id,
      });

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    }
  };
};
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-lg border-2">
        <div className="h-32 bg-blue-500 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-background">
                <Image
                  src={user.profile_pic || user_image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
                {/* edit option */}

                {
                  isYourAccount && (<>

                    <Button variant={"secondary"} size={"icon"} onClick={handleClick} className="absolute bottom-0 right-0 roudned-full h-10 w-10 shadow-lg">
                      <CameraIcon size={18} />
                    </Button>
                    <input type="file" className="hidden" accept="image/*" ref={inputRef} onChange={changehandler} />
                  </>)
                }

              </div>
            </div>
          </div>
        </div>
        {/* main content */}

        <div className="pt-20 pb-8 px-8 ">
          <div className="flex flex-col items-start justify-between flex-wrap gap-4">
              <div className="flex">
              <h2 className="text-3xl font-bold ">{name || user.name}</h2>
              {/* edit btn */}
              {isYourAccount && (
                <div className="flex items-center gap-2">
                  <Dialog>
                      <DialogTrigger asChild>
                      <Button variant={"ghost"} size={"icon"} className="h-8 w-8" onClick={() => {
                        // Prefill editable fields using existing state vars
                        setName(user.name)
                        setEmail(user.email)
                        setPhoneNumber(String(user.phone_number))
                        setBio(user.bio || "")
                      }}>
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>
                    {/* secondary trigger (kept for clarity) */}









                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>Update about, contact number and email.</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-2 mt-2">
                          <div>
                            <Label>Name</Label>
                            <Input value={name || user.name} onChange={(e) => setName(e.target.value)} />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input value={email || user.email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={phoneNumber ?? String(user.phone_number)} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div>
                          <Label>About</Label>
                          <textarea
                            className="w-full rounded-lg border px-2.5 py-1 text-base"
                            rows={4}
                              value={bio ?? (user.bio || "")}
                              onChange={(e) => setBio(e.target.value)}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={async () => {
                              // normalize and validate Indian phone number (10 digits, starts with 6-9)
                              const normalizePhone = (p: string) => {
                                if (!p) return "";
                                // remove non-digits
                                let digits = p.replace(/\D/g, "");
                                // strip leading country code 91 or leading 0
                                if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
                                if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
                                return digits;
                              };

                              const isValidIndianPhone = (p: string) => {
                                const d = normalizePhone(p);
                                return /^[6-9]\d{9}$/.test(d);
                              };

                              const normalized = normalizePhone(phoneNumber || "");
                              if (phoneNumber && !isValidIndianPhone(phoneNumber)) {
                                toast.error("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
                                return;
                              }

                              try {
                                await updateProfile({ name, phone_number: Number(normalized) || undefined, bio, email });
                                // update local controlled inputs to normalized value so UI shows formatted number
                                setPhoneNumber(normalized);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <div className="flex items-center  gap-2 text-sm opacity-70">
              <Briefcase size={16} />
              <span className="capitalize"> {user.role}</span>
            </div>
          </div>
          {user.role === "jobseeker" && (user.bio || bio) && (
            <div className="mt-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2 text-aam font-medium">
                <FileText size={16} />
                <span>About</span>
              </div>
              <p className="text-muted-foreground">{user.bio || bio || ""}</p>
            </div>
          )}

          {/* cont info */}
          <div className="mt-8">
            <h2 className="tetx-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={16} />
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4 ">
              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors ">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Mail size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Email</p>
                  <p className="font-medium">{user.email || email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors ">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Phone size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Phone</p>
                  <p className="font-medium">{user.phone_number || phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* resume section */}

          {user.role === "jobseeker" && user.resume && (
            <div className="mt-8 ">
              <div>
                <h2 className="text-lg font-semibold mt-4 flex items-center gap-2 ">
                  <NotepadText size={16} />
                  Resume
                </h2>

                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <NotepadText size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 ">

                    <div className="text-sm font-medium">Resume Document</div>
                    <Link href={user.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Resume
                    </Link>
                  </div>

                  <Button variant={"outline"} size={"sm"} onClick={handleResumeClick} className="gap-2">Update</Button>
                  <input type="file" ref={resumeRef} className="hidden" accept="application/pdf" onChange={changeResume} />

                </div>
              </div>
            </div>
          )}
        </div>
      </Card>


    </div>
  );
};

export default Info;
