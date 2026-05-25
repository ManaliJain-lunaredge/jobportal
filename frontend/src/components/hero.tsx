import React from "react"
import Image from "next/image"
import { TrendingUp, Search } from "lucide-react"
import { Button } from "./ui/button"
import hero from "../assets/hero.jpg"

const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Decorative blurred shapes */}
            <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 opacity-20 blur-3xl pointer-events-none" />
          

            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    {/* Left: content */}
                    <div className="md:col-span-7 lg:col-span-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-background/60 backdrop-blur-sm shadow-sm">
                            <TrendingUp size={16} className="text-blue-600" />
                            <span className="text-sm font-medium">#1 Job Platform in India</span>
                        </div>

                        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Find your next opportunity at
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Hire<span className="text-red-500"> Hub</span></span>
                        </h1>

                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                            Connect with top employers, get matched to roles that fit your skills, and accelerate your career with personalized job recommendations and an easy application flow.
                        </p>

                     

                        {/* CTAs & stats */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
                           

                            <div className="mt-3 sm:mt-0 text-sm text-muted-foreground flex items-center gap-6">
                                <div>
                                    <div className="text-lg font-semibold">120k+</div>
                                    <div className="opacity-70">Jobs posted</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">50k+</div>
                                    <div className="opacity-70">Companies</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">2M+</div>
                                    <div className="opacity-70">Candidates</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: illustration */}
                    <div className="md:col-span-5 lg:col-span-6 flex justify-center md:justify-end">
                        <div className="w-full  border border-border rounded-2xl p-2">
                            <div className="overflow-hidden rounded-lg">
                                <Image src={hero} alt="Hero" width={720} height={420} className="w-full h-auto object-cover rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
