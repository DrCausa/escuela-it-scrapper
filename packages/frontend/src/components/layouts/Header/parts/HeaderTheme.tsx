import Icon from "@components/commons/Icon";
import { useTheme } from "@hooks/useTheme";
import { useState } from "react";

const HeaderTheme = () => {
  const [themeHovered, setThemeHovered] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setThemeHovered(false)}
      onMouseLeave={() => setThemeHovered(true)}
      className="flex items-center px-3 py-1 gap-1 hover:cursor-pointer"
    >
      <Icon
        className="!text-[28px] transition-all duration-500 ease-out"
        iconName={theme === "Light" ? "dark_mode" : "light_mode"}
        isFilled={themeHovered}
      />
    </button>
  );
};

export default HeaderTheme;
