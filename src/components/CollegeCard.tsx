import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, MapPin, CheckCircle, Download, ChevronRight, Trophy, Briefcase, Bookmark } from "lucide-react";

interface CollegeCardProps {
  college: any;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/saved-colleges")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.some((sc) => sc.collegeId === college.id)) {
          setIsSaved(true);
        }
      })
      .catch(() => {});
  }, [college.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/saved-colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      if (res.status === 401) {
        window.location.href = "/auth";
        return;
      }
      const data = await res.json();
      setIsSaved(data.saved);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-44 w-full overflow-hidden">
        <Image 
          src={college.imageUrl} 
          alt={college.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <Image src={college.logoUrl} alt={`${college.shortName} Logo`} width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">{college.name}</h3>
              <p className="text-sm text-gray-200 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {college.location}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-gray-900">{college.rating}</span>
          <span className="text-xs text-gray-500">({college.reviewCount})</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
            {college.type}
          </span>
          {college.approvals.slice(0, 2).map((approval) => (
            <span key={approval} className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> {approval}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Trophy className="h-3 w-3"/> First Year Fee</p>
            <p className="font-semibold text-gray-900">₹{college.tuition.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Briefcase className="h-3 w-3"/> Avg Placement</p>
            <p className="font-semibold text-gray-900">{college.averagePlacement}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link href={`/college/${college.id}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
            Apply Now <ChevronRight className="h-4 w-4" />
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <Download className="h-4 w-4" /> Brochure
            </button>
            <Link href={`/compare?colleges=${college.id}`} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              Compare
            </Link>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isSaved ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white hover:text-blue-600'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
