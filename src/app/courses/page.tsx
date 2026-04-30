"use client";

import { PlayCircle, Award, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

const mockFreeCourses = [
  {
    id: "cs50",
    name: "CS50: Introduction to Computer Science",
    provider: "Harvard University (edX)",
    duration: "12 Weeks",
    description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
    link: "https://cs50.harvard.edu/"
  },
  {
    id: "nptel-dsa",
    name: "Data Structures and Algorithms",
    provider: "NPTEL / IIT Delhi",
    duration: "8 Weeks",
    description: "Comprehensive course on DSA provided by IIT faculty, highly recommended for placements.",
    link: "https://nptel.ac.in/"
  },
  {
    id: "fcc-web",
    name: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    duration: "300 Hours",
    description: "Learn HTML, CSS, and web design principles by building functional projects.",
    link: "https://www.freecodecamp.org/"
  },
  {
    id: "mit-python",
    name: "Intro to Computer Science and Programming in Python",
    provider: "MIT OpenCourseWare",
    duration: "9 Weeks",
    description: "Learn Python basics and how computing can be used to solve real-world problems.",
    link: "https://ocw.mit.edu/"
  }
];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-800 rounded-3xl p-8 md:p-12 mb-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-purple-200" /> Free Skill Courses
          </h1>
          <p className="text-purple-100 text-lg mb-6">
            Upskill for your future career without spending a dime. We've curated the best 100% free courses from top global universities and platforms.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
            <CheckCircle2 className="h-4 w-4 text-green-300" /> No hidden fees
          </div>
        </div>
        <div className="absolute -right-20 -top-20 opacity-10">
          <Award className="w-96 h-96" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {mockFreeCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
            <div className="p-6 md:p-8 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  100% Free
                </span>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                  {course.duration}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                {course.name}
              </h2>
              <p className="text-sm font-bold text-purple-600 mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" /> Provided by {course.provider}
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              <Link 
                href={course.link} 
                target="_blank"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <PlayCircle className="h-5 w-5" /> Start Learning Now <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
