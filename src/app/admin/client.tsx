"use client";

import { useState } from "react";
import { updateCollegeImages } from "./actions";

export default function AdminDashboardClient({ initialColleges }: { initialColleges: any[] }) {
  const [colleges, setColleges] = useState(initialColleges);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [imageUrl, setImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEditing = (college: any) => {
    setEditingId(college.id);
    setImageUrl(college.imageUrl);
    setLogoUrl(college.logoUrl);
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const result = await updateCollegeImages(id, imageUrl, logoUrl);
    if (result.success) {
      setColleges(colleges.map(c => c.id === id ? { ...c, imageUrl, logoUrl } : c));
      setEditingId(null);
    } else {
      alert("Failed to update. Check console.");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50" />
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Manage college listings and update images here.</p>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search colleges to edit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white/50">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-900 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">College Name</th>
                <th className="px-6 py-4">Logo URL</th>
                <th className="px-6 py-4">Campus Image URL</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredColleges.map((college) => (
                <tr key={college.id} className="hover:bg-white/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    {/* Small thumbnail preview */}
                    <img src={college.logoUrl} alt="logo" className="w-8 h-8 rounded-full object-cover border border-gray-200" onError={(e) => e.currentTarget.style.display = 'none'} />
                    {college.name}
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingId === college.id ? (
                      <input 
                        type="text" 
                        value={logoUrl} 
                        onChange={e => setLogoUrl(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    ) : (
                      <span className="truncate block w-48 text-xs">{college.logoUrl}</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingId === college.id ? (
                      <input 
                        type="text" 
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    ) : (
                      <span className="truncate block w-48 text-xs">{college.imageUrl}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {editingId === college.id ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleSave(college.id)} 
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(college)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        Edit Images
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredColleges.length === 0 && (
            <div className="p-8 text-center text-gray-500">No colleges found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
