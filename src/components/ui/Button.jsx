export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/20 focus:ring-teal-500",
    secondary: "bg-[#181818] text-slate-200 border border-[#2a2a2a] hover:bg-[#222222] hover:border-[#383838] focus:ring-teal-500",
    outline: "border border-teal-500/80 text-teal-400 hover:bg-teal-950/30 focus:ring-teal-500",
    ghost: "text-slate-300 hover:bg-[#181818] hover:text-white focus:ring-slate-600",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-700/20 focus:ring-rose-500",
    subtleDanger: "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:ring-rose-400"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-5 py-3 gap-2.5",
    icon: "p-2"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
