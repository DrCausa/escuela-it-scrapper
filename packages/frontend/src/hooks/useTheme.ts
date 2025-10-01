import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: Dark)"
    ).matches;

    if (currentTheme === "Dark" || (!currentTheme && systemPrefersDark)) {
      setTheme("Dark");
      applyThemeClasses("Dark");
    } else {
      setTheme("Light");
      applyThemeClasses("Light");
    }
  }, []);

  const applyThemeClasses = (theme: "Light" | "Dark") => {
    if (theme === "Dark") {
      document.body.classList.add("dark", "scrollbar-dark");
      document.body.classList.remove("scrollbar-light");
    } else {
      document.body.classList.remove("dark", "scrollbar-dark");
      document.body.classList.add("scrollbar-light");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyThemeClasses(newTheme);
  };

  return { theme, toggleTheme };
}
