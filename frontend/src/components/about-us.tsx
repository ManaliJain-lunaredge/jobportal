"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Target, Sparkles, MapPin } from "lucide-react";

const Aboutus: React.FC = () => {
  return (
    <section className="bg-background/50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              We build human-first hiring experiences
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              At Hire Hub we connect great companies with great people. Our
              platform focuses on matching meaningful roles with candidates' skills
              and aspirations — powered by thoughtful design and responsible AI.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Users className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Candidates First</h4>
                  <p className="text-sm text-muted-foreground">We prioritise candidate experience and growth.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Sparkles className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Smart Matches</h4>
                  <p className="text-sm text-muted-foreground">Our AI surfaces opportunities that truly align with skills.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Contact Sales</Button>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="opacity-90 mb-4">
                Make hiring faster, fairer and more human. We surface the best
                roles while reducing bias and friction for candidates and
                recruiters alike.
              </p>

              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm opacity-80">Cities</dt>
                  <dd className="text-lg font-semibold flex items-center gap-2"><MapPin /> Bangalore, Mumbai</dd>
                </div>
                <div>
                  <dt className="text-sm opacity-80">Teams</dt>
                  <dd className="text-lg font-semibold flex items-center gap-2"><Target /> Product, Engineering, Data</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { name: "Trusted companies", value: "120k+" },
                { name: "Active jobs", value: "50k+" },
                { name: "Candidates", value: "2M+" },
              ].map((stat) => (
                <div key={stat.name} className="p-4 rounded-lg bg-secondary/30 border">
                  <div className="text-sm text-muted-foreground">{stat.name}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-card/50 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-4">Our values</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Empathy</h4>
              <p className="text-sm text-muted-foreground">We design with empathy for both candidates and employers.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Transparency</h4>
              <p className="text-sm text-muted-foreground">Clear expectations and honest recommendations.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Integrity</h4>
              <p className="text-sm text-muted-foreground">We protect user data and build responsibly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
