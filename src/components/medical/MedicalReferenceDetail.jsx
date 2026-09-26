import Modal from "../ui/Modal";
import { Clock, ShieldCheck, Tag, AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

export default function MedicalReferenceDetail({ reference, isOpen, onClose }) {
  if (!reference) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
              {reference.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{reference.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {reference.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {reference.summary}
          </p>
        </div>

        {/* Key Takeaways Box */}
        <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Essential Clinical Takeaways</span>
          </h4>
          <ul className="space-y-1.5">
            {reference.keyPoints.map((point, i) => (
              <li key={i} className="text-xs sm:text-sm text-teal-950 dark:text-teal-200 flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Full Article Content */}
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {reference.fullArticle}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {reference.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <Tag className="w-3 h-3 opacity-60" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Clinical Disclaimer:</strong> Medical reference content is provided for informational and educational purposes only. If you or someone around you is experiencing severe symptoms or a life-threatening emergency, call your local emergency services immediately.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close Reference
          </Button>
        </div>
      </div>
    </Modal>
  );
}
