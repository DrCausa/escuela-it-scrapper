import Button from "@components/commons/Button";
import Card from "@components/commons/Card";
import Icon from "@components/commons/Icon";
import { useNotify } from "@contexts/NotificationContext";
import { useTheme } from "@hooks/useTheme";
import { setData } from "@services/api/controllers/dataManager";
import { get_content, scrape } from "@services/api/controllers/scrapper";
import { flattenClasses } from "@utils/classNames";
import Input from "@components/commons/Input";
import { usePageTitle } from "@hooks/usePageTitle";
import { useState } from "react";

const AppStatus = {
  IDLE: "Waiting for URL...",
  READY: "Ready to scrape",
  LOADING: "Scraping...",
  SUCCESS: "URL scrapped successfully",
  ERROR: "An error occurred",
  INVALID_URL: "The provided URL is not valid",
} as const;

type AppStatus = (typeof AppStatus)[keyof typeof AppStatus];

const HomePage = () => {
  usePageTitle("Home");
  useTheme();

  const { setNotify } = useNotify();
  const [currStatus, setCurrStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  // Agregado, constantes del checkbox
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  //

  const handleClick = async () => {
    setIsLoading(true);
    setCurrStatus(AppStatus.LOADING);

    try {
      const result = await scrape(url);
      const contentResult = await get_content(result.result);
      if (result.status === "error" || contentResult.status === "error") {
        setCurrStatus(AppStatus.ERROR);
        return;
      }
      const uuid = crypto.randomUUID();
      const now = Date.now();
      const urlParts = url.split("/clase/");
      await setData({
        id: uuid,
        fileName: urlParts[1] + "-" + now + ".txt",
        generatedAt: now,
        content: contentResult.result,
      });
      setNotify("/history", true);
      setCurrStatus(AppStatus.SUCCESS);
    } catch (err) {
      setCurrStatus(AppStatus.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const changeURL = (newUrl: string) => {
    let newStatus: AppStatus = AppStatus.READY;
    const urlPattern = /^https:\/\/escuela\.it\/cursos\/[^/]+\/clase\/[^/]+/i;

    if (!urlPattern.test(newUrl)) {
      newStatus = AppStatus.INVALID_URL;
    }

    if (newUrl === "") {
      newStatus = AppStatus.IDLE;
    }

    setCurrStatus(newStatus);

    setUrl(newUrl);
  };

  return (
    <div className="flex flex-col">
      <Card className="w-[32rem] mx-auto mt-15 flex flex-col">
        <h5 className="text-center text-[32px] mb-4">EscuelaIT Scrapper</h5>
        <div className="flex flex-col items-center mb-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Provide a Content URL in this format:
          <code>
            https://escuela.it/cursos/
            <span className="text-btn-warning-bg-hover">[COURSE]</span>
            /clase/
            <span className="text-btn-warning-bg-hover">[CONTENT]</span>
          </code>
        </div>
        <Input
          onChange={(e) => changeURL(e.target.value)}
          value={url}
          layoutClassName="mb-4"
          label="Content URL"
          iconName="link"
          disabled={isLoading}
        />

        <div className="
        flex align-items-center mb-8 pl-1 
        text-text-secondary-light dark:text-text-secondary-dark text-xs
        gap-4">
          Do you want the file to include the timestamp for each topic?:
          <div className="flex items-center gap-1 
          text-text-secondary-light dark:text-text-secondary-dark">
            <input
              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded-xs 
              dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              id="topping"
              name="topping"
              value="Paneer"
              checked={isChecked}
              onChange={handleOnChange}
            />
            I want
          </div>
        </div>

        <Button
          buttonType="secondary"
          className="uppercase flex justify-center gap-1"
          onClick={handleClick}
          style={{
            fontWeight: "400",
          }}
          disabled={
            currStatus !== AppStatus.READY && currStatus !== AppStatus.SUCCESS
          }
          isLoading={isLoading}
        >
          Start Scraping
          <Icon iconName="category_search" />
        </Button>
      </Card>
      <code className="text-base w-full text-center my-4 text-text-tertiary-light dark:text-text-tertiary-dark">
        &lt;{" "}
        <span
          className={flattenClasses(`
            text-text-secondary-light dark:text-text-secondary-dark
            ${
              currStatus === AppStatus.READY &&
              "animate-pulse !text-btn-primary-bg"
            }
            ${
              currStatus === AppStatus.LOADING &&
              "animate-pulse !text-btn-warning-bg"
            }
            ${currStatus === AppStatus.SUCCESS && "!text-btn-success-bg"}
            ${
              currStatus === AppStatus.ERROR ||
              currStatus === AppStatus.INVALID_URL
                ? "!text-btn-danger-bg"
                : ""
            }
          `)}
        >
          {currStatus}
        </span>{" "}
        &#47;&gt;
      </code>
    </div>
  );
};

export default HomePage;
