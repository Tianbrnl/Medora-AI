import { medicationCategories } from "../../data/mockMedications";

export default function MedicationFilters({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
      {medicationCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-teal-600 text-white shadow-sm shadow-teal-700/30 border border-teal-500"
                : "bg-white dark:bg-[#141414] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#242424] hover:bg-slate-100 dark:hover:bg-[#1f1f1f] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-[#333333]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
