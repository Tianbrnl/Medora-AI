export default function Avatar({ src, name, initials = "JN", size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs font-semibold",
    md: "w-9 h-9 text-xs font-bold",
    lg: "w-12 h-12 text-sm font-bold",
    xl: "w-16 h-16 text-lg font-bold"
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-teal-600 dark:bg-teal-600 text-white font-bold overflow-hidden shrink-0 shadow-xs tracking-wide select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name || "User avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
