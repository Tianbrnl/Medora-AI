import { Stethoscope, HelpCircle, Pill, Thermometer } from "lucide-react";

export default function SuggestedPrompts({ onSelectPrompt }) {
  const prompts = [
    {
      title: "What are common symptoms of the flu?",
      category: "Symptoms",
      icon: <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
    },
    {
      title: "What can cause frequent headaches?",
      category: "Causes",
      icon: <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
    },
    {
      title: "What is paracetamol used for?",
      category: "Medication",
      icon: <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
    },
    {
      title: "When should I see a doctor for a fever?",
      category: "Clinical Care",
      icon: <Thermometer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto px-4">
      {prompts.map((item, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(item.title)}
          className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 hover:shadow-sm text-left transition-all duration-150 group"
        >
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/60 transition-colors shrink-0">
            {item.icon}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-0.5">
              {item.category}
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
              {item.title}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
