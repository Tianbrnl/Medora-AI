import { Search, X } from "lucide-react";

export default function MedicationSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div className="relative w-full">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search medications..."
        className="w-full pl-12 pr-11 py-3 sm:py-3.5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#242424] hover:border-slate-300 dark:hover:border-[#333333] focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all shadow-sm"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
