import { Clock, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import Button from "../ui/Button";

export default function MedicalReferenceCard({ reference, onReadMore }) {
  return (
    <div className="flex flex-col justify-between bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-5 hover:border-slate-300 dark:hover:border-[#333333] hover:shadow-lg transition-all duration-200 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
            {reference.categoryName}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{reference.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
          {reference.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {reference.summary}
        </p>

        {/* Key Takeaways Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#242424] mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Key Clinical Points</span>
          </p>
          <ul className="space-y-1">
            {reference.keyPoints.slice(0, 2).map((point, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">•</span>
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-5">
          {reference.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <Tag className="w-2.5 h-2.5 opacity-60" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onReadMore(reference)}
        className="w-full justify-between group/btn hover:border-teal-500/60 dark:hover:border-teal-500/60 hover:text-teal-600 dark:hover:text-teal-400"
      >
        <span>Read Full Guide</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
