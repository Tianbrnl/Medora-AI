export default function Toggle({ enabled, onChange, label, description, id }) {
  return (
    <div className="flex items-center justify-between py-2">
      {(label || description) && (
        <div className="flex flex-col pr-4">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
          enabled ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
