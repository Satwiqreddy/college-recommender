import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Star, Trophy, Briefcase, GraduationCap, Download, Share2, CheckCircle, Heart, ChevronRight } from "lucide-react";

export default async function CollegePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const college = await prisma.college.findUnique({
    where: { id: resolvedParams.id },
    include: { courses: true },
  });

  if (!college) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/" className="hover:text-blue-600">Colleges</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium truncate">{college.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={college.imageUrl}
              alt={college.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Action Buttons on Banner */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            
            {/* Banner Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                <div className="relative h-24 w-24 md:h-32 md:w-32 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                  <Image src={college.logoUrl} alt={`${college.shortName} Logo`} fill className="object-contain p-2" />
                </div>
              </div>
              
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded">ESTD {college.establishedYear}</span>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">{college.type}</span>
                  {college.approvals.map(app => (
                    <span key={app} className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
                      {app}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">{college.name} ({college.shortName})</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {college.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-orange-400 fill-orange-400" /> {college.rating} ({college.reviewCount} Reviews)</span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg">
                  Apply Now
                </button>
                <button className="flex-1 md:flex-none bg-white text-gray-900 font-bold py-3 px-6 rounded-lg transition shadow-lg flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" /> Brochure
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-t border-gray-200">
            {["Info", "Courses & Fees", "Placements", "Reviews", "Gallery", "Admissions"].map((tab, i) => (
              <button 
                key={tab} 
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${i === 0 ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-orange-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          {/* About Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" /> About {college.shortName}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{college.description}</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <Trophy className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Ranking</h4>
                <p className="text-blue-800 text-sm">{college.ranking}</p>
              </div>
            </div>
          </section>

          {/* Courses & Fees Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Courses & Fees</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {college.courses.map((course, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-700">{course.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{course.duration}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{course.fees.toLocaleString("en-IN")}</p>
                      <p className="text-gray-500 text-xs">First Year Fee</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Eligibility:</strong> {course.eligibility}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Placements Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-600" /> Placements Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                <p className="text-green-800 font-medium mb-1">Highest Package</p>
                <p className="text-3xl font-extrabold text-green-600">{college.highestPlacement}</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                <p className="text-blue-800 font-medium mb-1">Average Package</p>
                <p className="text-3xl font-extrabold text-blue-600">{college.averagePlacement}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Top Recruiters</h3>
              <div className="flex flex-wrap gap-3">
                {['Microsoft', 'Google', 'Amazon', 'TCS', 'Infosys', 'Wipro'].map((company, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-6 w-6 text-orange-500 fill-orange-500" /> Student Reviews
              </h2>
              <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-medium py-1.5 px-3 rounded-lg transition-colors">
                Write a Review
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
              <div className="text-4xl font-extrabold text-gray-900">{college.rating}</div>
              <div>
                <div className="flex text-orange-400 mb-1">
                  {[...Array(5)].map((_, i) => {
                    // Rating is out of 10 in mock data, let's normalize to 5 for stars
                    const starRating = college.rating / 2;
                    return (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(starRating) ? 'fill-orange-400' : (i < Math.ceil(starRating) ? 'fill-orange-400 opacity-50' : 'text-gray-300')}`} />
                    )
                  })}
                </div>
                <p className="text-sm text-gray-500">Based on {college.reviewCount} reviews</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: "Rahul S.", year: "2023", course: "B.Tech Computer Science", text: "Excellent faculty and great campus life. The placement cell is very active.", rating: 5 },
                { name: "Priya M.", year: "2022", course: "MBA", text: "Good infrastructure, but the fees are a bit on the higher side. Overall a decent experience.", rating: 4 },
                { name: "Amit K.", year: "2024", course: "B.Tech Electronics", text: "Academics are rigorous. Hostel facilities could be improved.", rating: 4 }
              ].map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-500">{review.course} • Class of {review.year}</p>
                    </div>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-orange-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mt-2">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* Highlights Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Placement Highlights</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-green-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Highest Package</p>
                  <p className="text-xl font-bold text-gray-900">{college.highestPlacement}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Average Package</p>
                  <p className="text-xl font-bold text-gray-900">{college.averagePlacement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Lead Gen Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Interested in {college.shortName}?</h3>
            <p className="text-blue-100 text-sm mb-6">Get expert guidance for your admission process.</p>
            <form className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 rounded-lg text-gray-900" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-2 rounded-lg text-gray-900" />
              <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-2 rounded-lg text-gray-900" />
              <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-2 transition">
                Request a Callback
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
