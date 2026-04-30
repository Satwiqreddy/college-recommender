"use client";

import { Calendar, Clock, ExternalLink, GraduationCap, AlertCircle } from "lucide-react";
import Link from "next/link";

const mockExams = [
  {
    id: "jee-main-2",
    name: "JEE Main (Session 2)",
    fullName: "Joint Entrance Examination - Main",
    applicationDeadline: "2026-06-15",
    examDate: "2026-07-20",
    description: "National level entrance exam for admission to NITs, IIITs, and CFTIs.",
    website: "https://jeemain.nta.ac.in/"
  },
  {
    id: "jee-adv",
    name: "JEE Advanced",
    fullName: "Joint Entrance Examination - Advanced",
    applicationDeadline: "2026-08-10",
    examDate: "2026-08-28",
    description: "Exclusive entrance exam for admission to the Indian Institutes of Technology (IITs).",
    website: "https://jeeadv.ac.in/"
  },
  {
    id: "bitsat",
    name: "BITSAT",
    fullName: "BITS Admission Test",
    applicationDeadline: "2026-05-30",
    examDate: "2026-06-18",
    description: "Entrance exam for admission to BITS Pilani, Goa, and Hyderabad campuses.",
    website: "https://www.bitsadmission.com/"
  },
  {
    id: "comedk",
    name: "COMEDK UGET",
    fullName: "Consortium of Medical, Engineering and Dental Colleges of Karnataka",
    applicationDeadline: "2026-05-05",
    examDate: "2026-05-25",
    description: "State level entrance exam for engineering colleges in Karnataka.",
    website: "https://www.comedk.org/"
  },
  {
    id: "ts-eamcet",
    name: "TS EAMCET",
    fullName: "Telangana State Engineering, Agriculture & Medical Common Entrance Test",
    applicationDeadline: "2026-05-12",
    examDate: "2026-06-05",
    description: "State level entrance exam for colleges in Telangana.",
    website: "https://eamcet.tsche.ac.in/"
  }
];

export default function ExamsPage() {
  // Simple check if date is close
  const isApproaching = (dateString: string) => {
    const deadline = new Date(dateString);
    const now = new Date("2026-04-29"); // Mock current date based on context
    const diffTime = Math.abs(deadline.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 45;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-800 rounded-3xl p-8 md:p-12 mb-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3">
            <Calendar className="h-10 w-10 text-teal-200" /> Upcoming Exams
          </h1>
          <p className="text-teal-50 text-lg mb-4">
            Track application deadlines and exam dates for major engineering and medical entrance exams.
            Don't miss out on your chance to secure a seat in top colleges!
          </p>
        </div>
        <div className="absolute -right-20 -top-20 opacity-10">
          <GraduationCap className="w-96 h-96" />
        </div>
      </div>

      <div className="grid gap-6">
        {mockExams.map((exam) => {
          const urgent = isApproaching(exam.applicationDeadline);
          return (
            <div key={exam.id} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{exam.name}</h2>
                    {urgent && (
                      <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Closing Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 font-medium text-sm mb-4">{exam.fullName}</p>
                  <p className="text-gray-700 mb-6">{exam.description}</p>
                  
                  <div className="flex flex-wrap gap-4 md:gap-8 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Application Deadline</p>
                      <p className={`font-semibold flex items-center gap-2 ${urgent ? 'text-red-600' : 'text-gray-900'}`}>
                        <Clock className="h-4 w-4" /> {new Date(exam.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Exam Date</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" /> {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Link href={exam.website} target="_blank" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center shadow-md flex items-center justify-center gap-2">
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link href={`/predictor?exam=${encodeURIComponent(exam.name)}`} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors text-center">
                    View Colleges
                  </Link>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
