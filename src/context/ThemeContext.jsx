import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("doctorai_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("doctorai_theme", theme);

    const root = document.documentElement;
    const body = document.body;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
        if (body) {
          body.classList.add("dark");
          body.classList.remove("light");
        }
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
        if (body) {
          body.classList.remove("dark");
          body.classList.add("light");
        }
        root.style.colorScheme = "light";
      }
    };

    applyTheme();

    if (theme === "system") {
      const listener = () => applyTheme();
      // Support both modern and older listener APIs
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener);
        return () => mediaQuery.removeListener(listener);
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
