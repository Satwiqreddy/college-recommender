import Link from "next/link";
import { GraduationCap, Search, Menu, User, Bell } from "lucide-react";
import { getSession } from "@/lib/auth";

export default async function Navbar() {
  const session = await getSession();
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight ml-1">Colleges<span className="text-blue-600">360</span></span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Colleges
              </Link>
              <Link href="/courses" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Courses
              </Link>
              <Link href="/exams" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Exams
              </Link>
              <Link href="/qa" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Community
              </Link>
              <Link href="/compare" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Compare
              </Link>
              <Link href="/predictor" className="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200">
                Predictor
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            {session ? (
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{session.name}</span>
              </Link>
            ) : (
              <Link href="/auth" className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <User className="h-5 w-5" />
                Sign In
              </Link>
            )}

            <div className="flex items-center md:hidden ml-2">
              <button className="text-gray-400 hover:text-gray-500 p-2">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
