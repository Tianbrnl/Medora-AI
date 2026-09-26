import { useState, useMemo } from "react";
import { Search, X, AlertCircle } from "lucide-react";
import { medicalCategories, mockMedicalReferences } from "../data/mockMedicalReference";
import MedicalReferenceCard from "../components/medical/MedicalReferenceCard";
import MedicalReferenceDetail from "../components/medical/MedicalReferenceDetail";

export default function MedicalReference() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeReference, setActiveReference] = useState(null);

  const filteredReferences = useMemo(() => {
    return mockMedicalReferences.filter((ref) => {
      const matchesCategory =
        selectedCategory === "all" || ref.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ref.title.toLowerCase().includes(q) ||
        ref.summary.toLowerCase().includes(q) ||
        ref.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        ref.categoryName.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto chat-scroll font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-[#1c1c1c]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medical Knowledge Reference
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Verified health topics, anatomical overviews, emergency first-aid protocols, and clinical prevention strategies.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="bg-white dark:bg-[#111111] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs space-y-4 transition-colors duration-200">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medical topics (e.g. CPR, diabetes, fever, cardiovascular)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
            {medicalCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${isActive
                      ? "bg-teal-600 text-white shadow-xs shadow-teal-700/20"
                      : "bg-slate-100 dark:bg-[#181818] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-200/60 dark:hover:bg-[#202020] hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reference Cards Grid */}
        {filteredReferences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReferences.map((ref) => (
              <MedicalReferenceCard
                key={ref.id}
                reference={ref}
                onReadMore={(item) => setActiveReference(item)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No reference guides found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any medical topics matching "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <MedicalReferenceDetail
        reference={activeReference}
        isOpen={Boolean(activeReference)}
        onClose={() => setActiveReference(null)}
      />
    </div>
  );
}
