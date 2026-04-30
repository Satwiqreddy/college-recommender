"use client";

import { useState, useEffect } from "react";
import { LogOut, Bookmark, Scale, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";

export default function ProfileClientPage({ allColleges }: { allColleges: any[] }) {
  const [user, setUser] = useState<any>(null);
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      if (!authData.user) {
        window.location.href = "/auth";
        return;
      }
      setUser(authData.user);

      const [collegesRes, comparisonsRes] = await Promise.all([
        fetch("/api/saved-colleges"),
        fetch("/api/saved-comparisons")
      ]);

      const collegesData = await collegesRes.json();
      const comparisonsData = await comparisonsRes.json();

      setSavedColleges(collegesData);
      setSavedComparisons(comparisonsData);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (isLoading) return <div className="text-center py-20">Loading profile...</div>;
  if (!user) return null;

  const actualSavedColleges = savedColleges
    .map(sc => allColleges.find(mc => mc.id === sc.collegeId))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-md">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-blue-500" /> Saved Colleges ({actualSavedColleges.length})
          </h2>
          {actualSavedColleges.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You haven't saved any colleges yet.</p>
              <Link href="/" className="text-blue-600 font-bold hover:underline">Browse Colleges</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {actualSavedColleges.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Scale className="h-6 w-6 text-purple-500" /> Saved Comparisons
          </h2>
          {savedComparisons.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No comparisons saved yet.</p>
              <Link href="/compare" className="text-blue-600 font-bold hover:underline">Compare Colleges</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedComparisons.map(comp => {
                const collegeIds = JSON.parse(comp.colleges);
                const query = `colleges=${collegeIds.join(",")}`;
                return (
                  <Link 
                    key={comp.id} 
                    href={`/compare?${query}`}
                    className="block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{comp.name}</h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-500">{collegeIds.length} Colleges Compared</p>
                    <p className="text-xs text-gray-400 mt-2">Saved on {new Date(comp.createdAt).toLocaleDateString()}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
