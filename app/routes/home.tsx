import type { Route } from "./+types/home";
import * as domain from "node:domain";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smarter Feedback To Land Your Dream Job" },
  ];
}

export default function Home() {
    return <main className = "bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
            <div className ="page-heading">
                <h1>Track Your Applications & Resume Ratings</h1>
                <h2>Review Your Submissions and Receive AI Powered Feedback</h2>
            </div>

            {resumes.length > 0 && (
                <div className ="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key ={resume.id} resume = {resume} />
                    ))}
                </div>
            )}

    </section>

    </main>
}


