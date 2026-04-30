"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, Plus, Star, MapPin, Trophy, Check, Sparkles, Scale, Bookmark, PlusCircle } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";

function CompareContent({ allColleges }: { allColleges: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isFirstRender = useRef(true);
  const currentIdsStr = searchParams.get("colleges") || "";

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const initialIds = currentIdsStr.split(",").filter(Boolean);
      
      if (initialIds.length > 0) {
        const collegesToCompare = initialIds
          .map(id => allColleges.find(c => c.id === id))
          .filter((c): c is any => c !== undefined);
        
        if (collegesToCompare.length === 1) {
          const otherCollege = allColleges.find(c => c.id !== collegesToCompare[0].id);
          if (otherCollege) collegesToCompare.push(otherCollege);
        }
        
        setSelectedColleges(collegesToCompare.slice(0, 3));
      } else {
        setSelectedColleges(allColleges.slice(0, 2));
      }
      return;
    }

    if (!currentIdsStr) {
      setSelectedColleges([]);
    } else {
      const ids = currentIdsStr.split(",");
      const collegesToCompare = ids
        .map(id => allColleges.find(c => c.id === id))
        .filter((c): c is any => c !== undefined);
      setSelectedColleges(collegesToCompare.slice(0, 3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdsStr]);

  const updateUrl = (colleges: any[]) => {
    const ids = colleges.map(c => c.id).join(",");
    const params = new URLSearchParams(searchParams);
    if (ids) {
      params.set("colleges", ids);
    } else {
      params.delete("colleges");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const removeCollege = (id: string) => {
    const newColleges = selectedColleges.filter(c => c.id !== id);
    setSelectedColleges(newColleges);
    updateUrl(newColleges);
  };

  const addCollege = (college: any) => {
    if (selectedColleges.length < 3 && !selectedColleges.find(c => c.id === college.id)) {
      const newColleges = [...selectedColleges, college];
      setSelectedColleges(newColleges);
      updateUrl(newColleges);
      setIsModalOpen(false);
      setSearchQuery("");
    }
  };

  const availableColleges = allColleges.filter(
    c => !selectedColleges.find(sc => sc.id === c.id) && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlacementPercentageVal = (rating: number) => {
    return Math.min(99, Math.floor(75 + (rating * 2.5)));
  };

  const getPlacementPercentage = (rating: number) => getPlacementPercentageVal(rating) + "%";

  const parseLPA = (str: string) => parseFloat(str?.replace(/[^0-9.]/g, '') || "0") || 0;

  const bestTuition = selectedColleges.length > 1 ? Math.min(...selectedColleges.map(c => c.tuition || 0)) : null;
  const bestHighestPackage = selectedColleges.length > 1 ? Math.max(...selectedColleges.map(c => parseLPA(c.highestPlacement))) : null;
  const bestAveragePackage = selectedColleges.length > 1 ? Math.max(...selectedColleges.map(c => parseLPA(c.averagePlacement))) : null;
  const bestRating = selectedColleges.length > 1 ? Math.max(...selectedColleges.map(c => c.rating || 0)) : null;

  const getRecommendation = () => {
    if (selectedColleges.length < 2) return null;
    let scores = selectedColleges.map(c => ({ id: c.id, score: 0 }));
    
    selectedColleges.forEach(c => {
      let score = 0;
      if ((c.tuition || 0) === bestTuition) score += 1.5; // Weight affordability
      if (c.rating === bestRating) score += 1;
      if (parseLPA(c.highestPlacement) === bestHighestPackage) score += 1;
      if (parseLPA(c.averagePlacement) === bestAveragePackage) score += 1.5; // Weight average placement more
      scores.find(s => s.id === c.id)!.score = score;
    });

    const bestScore = Math.max(...scores.map(s => s.score));
    const winners = scores.filter(s => s.score === bestScore);
    if (winners.length === 1) {
      return selectedColleges.find(c => c.id === winners[0].id);
    }
    // Tie breaker
    let bestTieRating = Math.max(...winners.map(w => selectedColleges.find(c => c.id === w.id)!.rating));
    return selectedColleges.find(c => c.id === winners.find(w => selectedColleges.find(c => c.id === w.id)!.rating === bestTieRating)?.id);
  };

  const recommendedCollege = getRecommendation();

  const handleSaveComparison = async () => {
    if (selectedColleges.length < 2) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${selectedColleges[0].shortName} vs ${selectedColleges[1].shortName}${selectedColleges.length > 2 ? ' & more' : ''}`,
          colleges: selectedColleges.map(c => c.id)
        })
      });
      if (res.status === 401) {
        window.location.href = "/auth";
        return;
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedColleges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">No Colleges Selected for Comparison</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors">
          Add Colleges to Compare
        </button>
        {/* Modal for adding college when empty */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col text-left">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Select a College to Compare</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <input 
                  type="text" 
                  placeholder="Search colleges..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {availableColleges.length > 0 ? (
                  availableColleges.map(college => (
                    <div 
                      key={college.id} 
                      className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-100 transition-colors"
                      onClick={() => addCollege(college)}
                    >
                      <div className="h-12 w-12 relative bg-white rounded flex-shrink-0 border border-gray-200">
                        <Image src={college.logoUrl} alt={college.shortName} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{college.name}</h4>
                        <p className="text-xs text-gray-500">{college.location}</p>
                      </div>
                      <button className="ml-auto flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1.5 rounded-md">
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No colleges found matching your search.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Scale className="h-10 w-10 text-blue-600" /> Compare Colleges
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Side-by-side analysis of fees, placements, and ratings to help you decide.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedColleges.length >= 2 && (
            <button 
              onClick={handleSaveComparison}
              disabled={isSaving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold py-3 px-6 rounded-xl shadow-sm transition-all"
            >
              {saveSuccess ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Bookmark className="h-5 w-5" />}
              {saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save"}
            </button>
          )}
          {selectedColleges.length < 3 && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              <PlusCircle className="h-5 w-5" /> Add College
            </button>
          )}
        </div>
      </div>

      {recommendedCollege && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6 shadow-sm flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              Our Recommendation: <span className="text-orange-600">{recommendedCollege.name}</span>
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Based on a balanced analysis of fees, placements, and ratings, <strong>{recommendedCollege.shortName}</strong> offers the best overall value among your selections.
            </p>
          </div>
          <Link href={`/college/${recommendedCollege.id}`} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition shadow-md whitespace-nowrap">
            View College
          </Link>
        </div>
      )}

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[800px] border-collapse bg-white shadow-sm rounded-xl overflow-hidden table-fixed">
          <thead>
            <tr>
              <th className="w-[200px] p-6 bg-gray-50 border-b border-gray-200 text-left align-top">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Features</span>
              </th>
              {selectedColleges.map((college) => (
                <th key={college.id} className="p-6 border-b border-gray-200 border-l relative group w-[250px]">
                  {selectedColleges.length > 1 && (
                    <button 
                      onClick={() => removeCollege(college.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <XCircle className="h-6 w-6 bg-white rounded-full" />
                    </button>
                  )}
                  <div className="flex flex-col items-center text-center gap-3 mt-4">
                    <div className="h-24 w-24 relative bg-white rounded-lg p-2 border border-gray-100 shadow-sm flex items-center justify-center">
                      <Image src={college.logoUrl} alt={college.shortName} fill className="object-contain p-2" />
                    </div>
                    <Link href={`/college/${college.id}`} className="text-lg font-bold text-blue-600 hover:underline">
                      {college.shortName}
                    </Link>
                  </div>
                </th>
              ))}
              {selectedColleges.length < 3 && (
                <th className="p-6 border-b border-gray-200 border-l bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer w-[250px]" onClick={() => setIsModalOpen(true)}>
                  <div className="flex flex-col items-center justify-center h-full min-h-[150px] border-2 border-dashed border-gray-300 rounded-xl group-hover:border-blue-400">
                    <Plus className="h-10 w-10 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Add College</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Location */}
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Location</td>
              {selectedColleges.map(c => (
                <td key={c.id} className="p-4 border-l text-center text-gray-900">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4 text-orange-500"/>{c.location}
                  </div>
                </td>
              ))}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>
            
            {/* Type & Approvals */}
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Institute Type</td>
              {selectedColleges.map(c => <td key={c.id} className="p-4 border-l text-center text-gray-900">{c.type}</td>)}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Approvals</td>
              {selectedColleges.map(c => (
                <td key={c.id} className="p-4 border-l text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {c.approvals.map((app: string) => <span key={app} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{app}</span>)}
                  </div>
                </td>
              ))}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>
            
            {/* Fees */}
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">First Year Fees</td>
              {selectedColleges.map(c => (
                <td key={c.id} className={`p-4 border-l text-center transition-colors ${(c.tuition||0) === bestTuition ? 'bg-green-50/50' : ''}`}>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="font-extrabold text-gray-900 text-lg">₹{(c.tuition||0).toLocaleString('en-IN')}</span>
                    {(c.tuition||0) === bestTuition && <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"><Check className="h-3 w-3" /> Best Value</span>}
                  </div>
                </td>
              ))}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>

            {/* Placements */}
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Placement %</td>
              {selectedColleges.map(c => {
                const isBest = c.rating === bestRating;
                return (
                  <td key={c.id} className={`p-4 border-l text-center transition-colors ${isBest ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-extrabold text-blue-600 text-xl">{getPlacementPercentage(c.rating || 0)}</span>
                      {isBest && <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"><Trophy className="h-3 w-3" /> Top</span>}
                    </div>
                  </td>
                );
              })}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Highest Package</td>
              {selectedColleges.map(c => {
                const isBest = parseLPA(c.highestPlacement) === bestHighestPackage;
                return (
                  <td key={c.id} className={`p-4 border-l text-center transition-colors ${isBest ? 'bg-green-50/50' : ''}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-semibold text-green-600">{c.highestPlacement}</span>
                      {isBest && <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full"><Check className="h-3 w-3" /> Best</span>}
                    </div>
                  </td>
                );
              })}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">Average Package</td>
              {selectedColleges.map(c => {
                const isBest = parseLPA(c.averagePlacement) === bestAveragePackage;
                return (
                  <td key={c.id} className={`p-4 border-l text-center transition-colors ${isBest ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-semibold text-blue-600">{c.averagePlacement}</span>
                      {isBest && <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full"><Trophy className="h-3 w-3" /> Best</span>}
                    </div>
                  </td>
                );
              })}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>

            {/* Ratings */}
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700">User Rating</td>
              {selectedColleges.map(c => (
                <td key={c.id} className="p-4 border-l text-center">
                  <div className="flex items-center justify-center gap-1 font-bold text-gray-900 text-lg">
                    {c.rating} <Star className="h-5 w-5 text-orange-400 fill-orange-400" />
                  </div>
                  <span className="text-xs text-gray-500">Based on {c.reviewCount} reviews</span>
                </td>
              ))}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50"></td>}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 bg-gray-50 rounded-bl-xl"></td>
              {selectedColleges.map(c => (
                <td key={c.id} className="p-4 border-l text-center">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-md">
                    Apply Now
                  </button>
                </td>
              ))}
              {selectedColleges.length < 3 && <td className="p-4 border-l bg-gray-50/50 rounded-br-xl"></td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* College Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-900">Select a College to Compare</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-100">
              <input 
                type="text" 
                placeholder="Search colleges by name..." 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
              {availableColleges.length > 0 ? (
                availableColleges.map(college => (
                  <div 
                    key={college.id} 
                    className="flex items-center gap-4 p-3 bg-white hover:bg-blue-50 rounded-lg cursor-pointer border border-gray-100 shadow-sm hover:border-blue-200 transition-all"
                    onClick={() => addCollege(college)}
                  >
                    <div className="h-12 w-12 relative bg-white rounded flex-shrink-0 border border-gray-200">
                      <Image src={college.logoUrl} alt={college.shortName} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{college.name}</h4>
                      <p className="text-xs text-gray-500">{college.location}</p>
                    </div>
                    <button className="ml-auto flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <XCircle className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-600">No colleges found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompareClientPage({ allColleges }: { allColleges: any[] }) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded w-full max-w-4xl"></div>
        </div>
      </div>
    }>
      <CompareContent allColleges={allColleges} />
    </Suspense>
  );
}
