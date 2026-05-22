import React from "react"
import { BookOpen, Code, Cpu, Layers, CloudLightning } from "lucide-react"
import { Button } from "./ui/button"

const paths = [
  {
    title: "Machine Learning Engineer",
    desc: "Build and deploy ML models for production; focus on model optimization and scalability.",
    icon: <Cpu className="text-white" />,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Data Scientist",
    desc: "Analyze data, build models and derive insights to inform business decisions.",
    icon: <BookOpen className="text-white" />,
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Prompt Engineer",
    desc: "Design and iterate prompts and evaluation strategies for LLM-based systems.",
    icon: <CloudLightning className="text-white" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "MLOps Engineer",
    desc: "Automate model training, CI/CD and monitoring for ML workflows.",
    icon: <Layers className="text-white" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "AI Researcher",
    desc: "Explore new model architectures, publish papers and prototype innovations.",
    icon: <Code className="text-white" />,
    color: "from-sky-500 to-indigo-600",
  },
]

export default function CarrerGuide() {
  return (
    <section className="bg-background/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            AI Career Guide — Your roadmap to a future-proof career
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose a path, follow curated learning steps, and land the role you want. Each track includes skills, suggested resources and an easy starter project.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline">Get a personalized plan</Button>
            <Button variant="ghost">Explore resources</Button>
          </div>
        </div>

     

       
      </div>
    </section>
  )
}

