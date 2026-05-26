"use client";

import React from "react";
import { AccountProps } from "@/type";
import { Card } from "@/components/ui/card";
import user_image from "../../../assets/user_image.png";
import Image from "next/image";
import { Briefcase, FileText, NotepadText, Mail, Phone } from "lucide-react";
import Link from "next/link";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
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
              </div>
            </div>
          </div>
        </div>
        {/* main content */}

        <div className="pt-20 pb-8 px-8 ">
          <div className="flex flex-col items-start justify-between flex-wrap gap-4">
            <h2 className="text-3xl font-bold ">{user.name}</h2>
            {/* edit btn */}
            <div className="flex items-center  gap-2 text-sm opacity-70">
              <Briefcase size={16} />
              <span className="capitalize"> {user.role}</span>
            </div>
          </div>
          {user.role === "jobseeker" && user.bio && (
            <div className="mt-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2 text-aam font-medium">
                <FileText size={16} />
                <span>About</span>
              </div>
              <p className="text-muted-foreground">{user.bio}</p>
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
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors ">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Phone size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Phone</p>
                  <p className="font-medium">{user.phone_number}</p>
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
