import { useEffect } from "react";

const DEFAULT_SEPARATOR = " - ";
const DEFAULT_APP_TITLE = "EscuelaIT Scrapper";

export const usePageTitle = (pageTitle: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = pageTitle
      ? `${pageTitle}${DEFAULT_SEPARATOR}${DEFAULT_APP_TITLE}`
      : DEFAULT_APP_TITLE;

    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);
};
