"use client";

import CollegeCard from "@/components/CollegeCard";
import { Search, Filter, SlidersHorizontal, CheckSquare, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function HomeClient({ initialColleges }: { initialColleges: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [maxFees, setMaxFees] = useState<number>(500000);
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique states for filter
  const allStates = useMemo(() => {
    const states = new Set<string>();
    initialColleges.forEach(c => {
      const state = c.location.split(', ')[1];
      if (state) states.add(state);
    });
    return Array.from(states).sort();
  }, [initialColleges]);

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
    setCurrentPage(1);
  };

  // Filter colleges based on criteria
  const filteredColleges = useMemo(() => {
    return initialColleges.filter(college => {
      // Search
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            college.shortName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Location (State)
      const state = college.location.split(', ')[1];
      const matchesLocation = selectedStates.length === 0 || (state && selectedStates.includes(state));
      
      // Fees
      const matchesFees = (college.tuition || 0) <= maxFees;

      return matchesSearch && matchesLocation && matchesFees;
    });
  }, [initialColleges, searchTerm, selectedStates, maxFees]);

  // Pagination
  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Search Header */}
      <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 mb-10 shadow-xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 z-0"></div>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight drop-shadow-sm">
            Find Your Dream College
          </h1>
          <p className="text-blue-100 mb-8 text-lg md:text-xl max-w-2xl font-medium drop-shadow-sm">
            Discover top colleges in India, compare courses, fees, placements, and read authentic reviews from students.
          </p>
          <div className="flex bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl max-w-3xl border border-white/40 focus-within:ring-4 focus-within:ring-blue-400/30 transition-all duration-300">
            <div className="flex-1 flex items-center pl-6">
              <Search className="h-6 w-6 text-blue-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search for colleges by name..." 
                className="w-full py-5 px-4 text-gray-900 bg-transparent focus:outline-none text-lg font-medium placeholder:text-gray-400"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-10 transition-all duration-300 hover:shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" /> Filters
              </h2>
              <button 
                onClick={() => { setSelectedStates([]); setMaxFees(500000); setSearchTerm(""); setCurrentPage(1); }}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Fees Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  Max Annual Fees: ₹{maxFees.toLocaleString('en-IN')}
                </h3>
                <input 
                  type="range" 
                  min="50000" 
                  max="1000000" 
                  step="50000"
                  value={maxFees}
                  onChange={(e) => { setMaxFees(parseInt(e.target.value)); setCurrentPage(1); }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹50K</span>
                  <span>₹10L+</span>
                </div>
              </div>

              {/* State Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  State / Location
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {allStates.map(state => (
                    <label key={state} className="flex items-center gap-2 cursor-pointer group">
                      <div onClick={() => toggleState(state)}>
                        {selectedStates.includes(state) ? 
                          <CheckSquare className="h-4 w-4 text-blue-600" /> : 
                          <Square className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                        }
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 truncate" title={state}>{state}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* College List */}
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Found {filteredColleges.length} Colleges</h2>
          </div>

          {paginatedColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No colleges found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedStates([]); setMaxFees(1000000); setSearchTerm(""); }}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                // Show max 5 page buttons around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md font-medium transition-colors ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white border border-blue-600' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-gray-500">...</span>;
                }
                return null;
              })}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
