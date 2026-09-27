import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { medicationCategories as defaultCategories } from "../../data/mockMedications";

export default function MedicationFilters({
  categories = defaultCategories,
  activeCategory,
  onSelectCategory,
  onOpenDeleteCategory
}) {
  const scrollContainerRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Auto-scroll selected category into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeCategory]);

  // Touch and mouse drag-to-swipe handlers for smooth swiping on all devices
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    isDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      isDraggingRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleCategoryClick = (category) => {
    if (isDraggingRef.current) return;
    onSelectCategory(category);
  };

  return (
    <div className="relative w-full">
      {/* Pure Swipeable Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing pr-8 sm:pr-12 select-none"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain"
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const isAll = category === "All";

          if (isAll) {
            return (
              <button
                key={category}
                data-active={isActive ? "true" : "false"}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-700/30 border border-teal-500"
                    : "bg-white dark:bg-[#141414] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#242424] hover:bg-slate-100 dark:hover:bg-[#1f1f1f] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-[#333333]"
                }`}
              >
                {category}
              </button>
            );
          }

          return (
            <div
              key={category}
              data-active={isActive ? "true" : "false"}
              className={`shrink-0 inline-flex items-center rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-700/30 border border-teal-500"
                  : "bg-white dark:bg-[#141414] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#242424] hover:border-slate-300 dark:hover:border-[#333333]"
              }`}
            >
              <button
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`pl-3.5 pr-1.5 py-2 cursor-pointer focus:outline-none transition-colors ${
                  isActive
                    ? "text-white"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
              {onOpenDeleteCategory && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeleteCategory(category);
                  }}
                  title={`Delete category "${category}"`}
                  aria-label={`Delete category ${category}`}
                  className={`pr-2.5 pl-1 py-2 cursor-pointer transition-colors focus:outline-none rounded-r-full ${
                    isActive
                      ? "text-white/70 hover:text-white"
                      : "text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
