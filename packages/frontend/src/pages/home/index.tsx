import Button from "@components/commons/Button";
import Card from "@components/commons/Card";
import Icon from "@components/commons/Icon";
import { useNotify } from "@contexts/NotificationContext";
import { useTheme } from "@hooks/useTheme";
import {
  getTexttrackUrl,
  getVttContent,
  isValidEscuelaITUrl,
  vvtToPlainText,
} from "@services/api/controllers/scrapingController";
import { flattenClasses } from "@utils/classNames";
import Input from "@components/commons/Input";
import { usePageTitle } from "@hooks/usePageTitle";
import { useState } from "react";
import { playSound } from "@utils/playSound";
import type { Data, DataRow, ResultResponse } from "@services/api/types";
import { addToHistory } from "@services/api/controllers/historyController";

const AppStatus = {
  IDLE: "Waiting for URL...",
  READY: "Ready to scrape!",
  LOADING_PROFILE: "Loading user profile...",
  GETTING_TEXT_TRACK_URL: "Getting text track URL...",
  GETTING_VTT_CONTENT: "Getting VTT content...",
  CONVERTING_TO_PLAIN_TEXT: "Converting to plain text...",
  SAVING_TO_HISTORY: "Saving to history...",
  SUCCESS: "Scraping completed successfully!",
  ERROR_WHILE_SAVING: "Error while saving to history!",
  ERROR: "An error occurred...",
  INVALID_URL: "The provided URL is not valid!",
} as const;

type AppStatus = (typeof AppStatus)[keyof typeof AppStatus];

const HomePage = () => {
  usePageTitle("Home");
  useTheme();

  const { setNotify } = useNotify();
  const [currStatus, setCurrStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [appIsWaiting, setAppIsWaiting] = useState(false);
  const [url, setUrl] = useState("");
  const [checkboxVttContent, setIncludeVttContent] = useState(true);
  const [checkboxPlainText, setCheckboxPlainText] = useState(true);

  const handleClick = async () => {
    setCurrStatus(AppStatus.LOADING_PROFILE);
    setAppIsWaiting(true);

    try {
      let response: ResultResponse;
      let texttrackUrl, vttContent, plainText;
      let newData: Data = [];

      setCurrStatus(AppStatus.GETTING_TEXT_TRACK_URL);
      response = await getTexttrackUrl(url);

      if (response.status === "error" || !response.result) {
        setCurrStatus(AppStatus.ERROR);
        setAppIsWaiting(false);
        throw new Error(response.message || "Unknown error");
      }
      texttrackUrl = `${response.result}`;

      if (checkboxPlainText || (checkboxVttContent && texttrackUrl)) {
        setCurrStatus(AppStatus.GETTING_VTT_CONTENT);
        response = await getVttContent(texttrackUrl);
        if (response.status === "error" || !response.result) {
          setCurrStatus(AppStatus.ERROR);
          console.log(response);
          setAppIsWaiting(false);
          throw new Error(response.message || "Unknown error");
        }
        vttContent = `${response.result}`;

        if (checkboxVttContent) {
          const now = Date.now();
          const id = crypto.randomUUID();

          const newRow: DataRow = {
            id: id,
            fileName: `${id}-${now}.srt`,
            content: vttContent,
            generatedAt: now,
          };
          newData.push(newRow);
        }
      }

      if (checkboxPlainText && vttContent) {
        setCurrStatus(AppStatus.CONVERTING_TO_PLAIN_TEXT);
        response = await vvtToPlainText(vttContent);
        if (response.status === "error" || !response.result) {
          setCurrStatus(AppStatus.ERROR);
          console.log(response);
          setAppIsWaiting(false);
          throw new Error(response.message || "Unknown error");
        }
        plainText = `${response.result}`;

        const now = Date.now();
        const id = crypto.randomUUID();
        const newRow: DataRow = {
          id: id,
          fileName: `${id}-${now}.txt`,
          content: plainText,
          generatedAt: now,
        };
        newData.push(newRow);
      }

      if (newData && newData.length > 0) {
        setCurrStatus(AppStatus.SAVING_TO_HISTORY);

        try {
          for (const row of newData) {
            const response = await addToHistory(row);
            if (response.status !== "success") {
              setCurrStatus(AppStatus.ERROR_WHILE_SAVING);
              setAppIsWaiting(false);
              return;
            }
          }
          setCurrStatus(AppStatus.READY);
        } catch (err) {
          setCurrStatus(AppStatus.ERROR_WHILE_SAVING);
        }
      }

      setNotify("/history", true);
      setAppIsWaiting(false);
      setCurrStatus(AppStatus.SUCCESS);
      playSound("mp3");
    } catch (err) {
      setCurrStatus(AppStatus.ERROR);
      console.log(err);
      setAppIsWaiting(false);
    }
  };

  const changeURL = async (newUrl: string) => {
    let newStatus: AppStatus;

    if (newUrl.trim() === "") {
      newStatus = AppStatus.IDLE;
    } else {
      const response: ResultResponse = await isValidEscuelaITUrl(newUrl);

      if (response.result === true) {
        newStatus = AppStatus.READY;
      } else {
        newStatus = AppStatus.INVALID_URL;
      }
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className="flex flex-col"
        >
          <Input
            onChange={(e) => changeURL(e.target.value)}
            value={url}
            label="Content URL"
            iconName="link"
            layoutClassName="mb-4"
            disabled={appIsWaiting}
          />
          <div className="flex flex-col gap-4 mb-4">
            <Input
              type="checkbox"
              label="SubRip Subtitle (.srt)"
              checked={checkboxVttContent}
              onChange={() => setIncludeVttContent(!checkboxVttContent)}
              disabled={appIsWaiting}
            />
            <Input
              type="checkbox"
              label="Plain Text (.txt)"
              checked={checkboxPlainText}
              onChange={() => setCheckboxPlainText(!checkboxPlainText)}
              disabled={appIsWaiting}
            />
          </div>
          <Button
            buttonType="secondary"
            type="submit"
            className="uppercase flex flex-1 justify-center gap-1"
            style={{
              fontWeight: "400",
            }}
            disabled={
              (currStatus !== AppStatus.READY &&
                currStatus !== AppStatus.SUCCESS) ||
              appIsWaiting ||
              (!checkboxVttContent && !checkboxPlainText)
            }
            isLoading={appIsWaiting}
          >
            Start Scraping
            <Icon iconName="manufacturing" />
          </Button>
        </form>
      </Card>
      <code className="text-base w-full text-center my-4 text-text-tertiary-light dark:text-text-tertiary-dark">
        &lt;{" "}
        <span
          className={flattenClasses(`
            ${
              currStatus === AppStatus.IDLE &&
              "text-text-secondary-light dark:text-text-secondary-dark"
            }
            ${
              currStatus === AppStatus.READY &&
              "animate-pulse text-btn-primary-bg"
            }
            ${appIsWaiting && "animate-pulse text-btn-warning-bg"}
            ${
              currStatus === AppStatus.READY || currStatus === AppStatus.SUCCESS
                ? "text-btn-success-bg"
                : ""
            }
            ${
              currStatus === AppStatus.INVALID_URL ||
              currStatus === AppStatus.ERROR ||
              currStatus === AppStatus.ERROR_WHILE_SAVING
                ? "text-btn-danger-bg"
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
