import { flattenClasses } from "@utils/classNames";
import HeaderOptions from "@components/layouts/Header/parts/HeaderOptions";
import HeaderTheme from "@components/layouts/Header/parts/HeaderTheme";

const Header = () => {
  return (
    <nav
      className={flattenClasses(`
        z-100 px-8 py-2 border-b sticky top-0 flex shadow-sm justify-between backdrop-blur-sm
        bg-bg-primary-light/75 text-text-primary-light border-border-strong-light
        dark:bg-bg-primary-dark/75 dark:text-text-primary-dark dark:border-border-strong-dark
      `)}
    >
      <HeaderOptions />
      <HeaderTheme />
    </nav>
  );
};

export default Header;
