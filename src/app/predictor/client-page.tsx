"use client";

import { useState } from "react";
import CollegeCard from "@/components/CollegeCard";
import { Search, Calculator, Target, Award, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PredictorClientPage({ allColleges }: { allColleges: any[] }) {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState<number | "">("");
  const [predictedColleges, setPredictedColleges] = useState<any[] | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || typeof rank !== "number") return;

    let filtered: any[] = [];

    // Simple rule-based prediction
    const parseRank = (rankingStr: string) => {
      const match = rankingStr?.match(/\d+/);
      return match ? parseInt(match[0]) : 999;
    };

    const isIIT = (c: any) => c.name.toLowerCase().includes("iit") || c.tags.includes("IIT");
    const isNIT = (c: any) => c.name.toLowerCase().includes("nit ") || c.name.toLowerCase().startsWith("nit") || c.tags.includes("NIT");
    const isBITS = (c: any) => c.name.toLowerCase().includes("bits") || c.name.toLowerCase().includes("birla");

    if (exam === "JEE Advanced") {
      filtered = allColleges.filter(c => isIIT(c));
      if (rank > 5000) {
         filtered = filtered.filter(c => parseRank(c.ranking) > 5);
      }
    } else if (exam === "JEE Main") {
      // User specifically requested NIT colleges for JEE Mains
      filtered = allColleges.filter(c => isNIT(c));
      if (filtered.length === 0) {
         // Fallback if no NITs match or found, but we added some
         filtered = allColleges.filter(c => !isIIT(c) && parseRank(c.ranking) < 50);
      }
    } else if (exam === "AP EAPCET / TS EAMCET") {
      filtered = allColleges.filter(c => c.location.includes("Andhra Pradesh") || c.location.includes("Telangana"));
    } else if (exam === "KCET / COMEDK") {
      filtered = allColleges.filter(c => c.location.includes("Karnataka") && !isNIT(c));
    } else if (exam === "TNEA / TANCET") {
      filtered = allColleges.filter(c => c.location.includes("Tamil Nadu") && !isIIT(c) && !isNIT(c));
    } else if (exam === "BITSAT") {
       filtered = allColleges.filter(c => isBITS(c) || (c.type === "Private" && parseRank(c.ranking) < 30));
    } else {
      // Generic State CET / Others
      filtered = allColleges.filter(c => !isIIT(c) && !isNIT(c));
      if (rank <= 5000) {
        filtered = filtered.filter(c => parseRank(c.ranking) <= 40);
      } else if (rank <= 20000) {
        filtered = filtered.filter(c => parseRank(c.ranking) > 30 && parseRank(c.ranking) <= 80);
      } else {
        filtered = filtered.filter(c => parseRank(c.ranking) > 60);
      }
    }

    // Sort by ranking logically
    filtered.sort((a, b) => parseRank(a.ranking) - parseRank(b.ranking));
    
    // limit to top 6 suggestions to keep it clean
    setPredictedColleges(filtered.slice(0, 6));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 mb-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3">
            <Calculator className="h-10 w-10 text-orange-400" /> College Predictor
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Enter your competitive exam rank to get a personalized list of colleges you have a high chance of getting into.
          </p>
          
          <form onSubmit={handlePredict} className="bg-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam</label>
              <select 
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="BITSAT">BITSAT</option>
                <option value="AP EAPCET / TS EAMCET">AP EAPCET / TS EAMCET</option>
                <option value="KCET / COMEDK">KCET / COMEDK</option>
                <option value="TNEA / TANCET">TNEA / TANCET</option>
                <option value="MHT-CET">MHT-CET</option>
                <option value="WBJEE">WBJEE</option>
                <option value="CUET">CUET</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Rank</label>
              <input 
                type="number" 
                min="1"
                required
                value={rank}
                onChange={(e) => setRank(parseInt(e.target.value) || "")}
                placeholder="e.g. 15000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 h-[50px]"
              >
                <Target className="h-5 w-5" /> Predict
              </button>
            </div>
          </form>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -right-20 -top-20 opacity-10">
          <Award className="w-96 h-96" />
        </div>
      </div>

      {predictedColleges && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-500" /> 
            Predicted Colleges for {exam} Rank {rank}
          </h2>
          
          {predictedColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictedColleges.map(college => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No definitive matches found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Based on our current data and your rank, we couldn't find a strong match. Try exploring our complete college list.
              </p>
              <Link href="/" className="mt-6 inline-block bg-blue-50 text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-100 transition-colors">
                Browse All Colleges
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
