import Button from "@components/commons/Button";
import Card from "@components/commons/Card";
import Icon from "@components/commons/Icon";
import { useNotify } from "@contexts/NotificationContext";
import { useTheme } from "@hooks/useTheme";
import {
  generateVttContent,
  getM3u8Url,
  getTexttrackUrl,
  getVttContent,
  isValidEscuelaITUrl,
  saveAudioUsingM358Url,
  vvtToPlainText,
} from "@services/api/controllers/scrapingController";
import { flattenClasses } from "@utils/classNames";
import Input from "@components/commons/Input";
import { usePageTitle } from "@hooks/usePageTitle";
import { useState } from "react";
import { playSound } from "@utils/playSound";
import type { Data, DataRow, ResultResponse } from "@services/api/types";
import { addToHistory } from "@services/api/controllers/historyController";
import { formateDateForFileName } from "@/utils/formatDate";
import Tooltip from "@/components/commons/Tooltip";

const AppStatus = {
  IDLE: "Waiting for URL...",
  READY: "Ready to scrape!",
  LOADING_PROFILE: "Loading user profile...",
  GETTING_TEXT_TRACK_URL: "Getting text track URL...",
  GETTING_AUDIO_M3U8_URL: "Getting audio m3u8 URL...",
  GETTING_CLASS_AUDIO: "Getting class audio in .m4a format...",
  GETTING_VTT_CONTENT: "Getting existing VTT content...",
  GENERATING_VTT_CONTENT: "Generating new VTT content...",
  CONVERTING_TO_PLAIN_TEXT: "Converting to plain text...",
  SAVING_TO_HISTORY: "Saving to history...",
  SUCCESS: "Scraping completed successfully!",
  ERROR_WHILE_SAVING: "Error while saving to history!",
  ERROR_WHILE_GETTING_AUDIO: "Error while getting audio!",
  ERROR_WHILE_GENERATING_VTT: "Error while generating new VTT content!",
  ERROR_WHILE_GETTING_URLS:
    "An error occurred while trying to get the resource URLs!",
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
  const [checkboxAudio, setCheckboxAudio] = useState(false);
  const [checkboxForceVttContent, setCheckboxForceVttContent] = useState(false);

  const handleClick = async () => {
    setCurrStatus(AppStatus.LOADING_PROFILE);
    setAppIsWaiting(true);

    let response: ResultResponse | undefined;
    let texttrackUrl = "",
      m3u8Url = "",
      vttContent = "",
      plainText = "",
      audioFileName = "";
    let newData: Data = [];
    let hasTexttrackUrl = false;
    let hasM3u8Url = false;

    try {
      if (checkboxPlainText || checkboxVttContent) {
        setCurrStatus(AppStatus.GETTING_TEXT_TRACK_URL);
        response = await getTexttrackUrl(url);
        hasTexttrackUrl = true;
        texttrackUrl = `${response.result}`;
      }
    } catch (err) {}

    try {
      if ((checkboxAudio || !hasTexttrackUrl) && checkboxForceVttContent) {
        setCurrStatus(AppStatus.GETTING_AUDIO_M3U8_URL);
        response = await getM3u8Url(url);
        hasM3u8Url = true;
        m3u8Url = `${response.result}`;
      }
    } catch (err) {}

    if (response === undefined || (!hasTexttrackUrl && !hasM3u8Url)) {
      setCurrStatus(AppStatus.ERROR_WHILE_GETTING_URLS);
      setAppIsWaiting(false);
      return;
    }

    if (response.status === "error" || !response.result) {
      setCurrStatus(AppStatus.ERROR);
      setAppIsWaiting(false);
      return;
    }

    if (
      (hasTexttrackUrl && (checkboxVttContent || checkboxPlainText)) ||
      checkboxForceVttContent
    ) {
      setCurrStatus(AppStatus.GETTING_VTT_CONTENT);
      response = await getVttContent(texttrackUrl);
      if (response.status === "error" || !response.result) {
        setCurrStatus(AppStatus.ERROR);
        setAppIsWaiting(false);
        throw new Error(response.message || "Unknown error");
      }
      vttContent = `${response.result}`;

      if (checkboxVttContent) {
        const now = Date.now();
        const id = crypto.randomUUID();

        const newRow: DataRow = {
          id: id,
          file_name: `${id}-${formateDateForFileName(now)}.srt`,
          content: vttContent,
          generated_at: now,
        };
        newData.push(newRow);
      }
    }

    if (
      (!hasTexttrackUrl && hasM3u8Url) ||
      (checkboxAudio && hasM3u8Url) ||
      (checkboxForceVttContent && hasM3u8Url)
    ) {
      const now = Date.now();
      const id = crypto.randomUUID();
      const fileName = `${id}-${formateDateForFileName(now)}`;

      setCurrStatus(AppStatus.GETTING_CLASS_AUDIO);
      response = await saveAudioUsingM358Url(m3u8Url, fileName);
      if (response.status === "error" || !response.result) {
        setCurrStatus(AppStatus.ERROR_WHILE_GETTING_AUDIO);
        setAppIsWaiting(false);
        throw new Error(response.message || "Unknown error");
      }
      audioFileName = `${response.result}`;

      if (checkboxAudio) {
        const newRow: DataRow = {
          id: id,
          file_name: audioFileName,
          generated_at: now,
          is_audio: true,
        };
        newData.push(newRow);
      }

      if (!hasTexttrackUrl && (checkboxVttContent || checkboxPlainText)) {
        setCurrStatus(AppStatus.GENERATING_VTT_CONTENT);
        response = await generateVttContent(audioFileName);
        if (response.status === "error" || !response.result) {
          setCurrStatus(AppStatus.ERROR_WHILE_GENERATING_VTT);
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
            file_name: `${id}-${formateDateForFileName(now)}.srt`,
            content: vttContent,
            generated_at: now,
          };
          newData.push(newRow);
        }
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
        file_name: `${id}-${formateDateForFileName(now)}.txt`,
        content: plainText,
        generated_at: now,
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
        <div className="flex flex-col items-center mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Provide a Content URL in this format:
          <code>
            https://escuela.it/cursos/
            <span className="text-btn-primary-bg">[COURSE]</span>
            /clase/
            <span className="text-btn-primary-bg">[CONTENT]</span>
          </code>
          {checkboxForceVttContent && (
            <div className="mt-4 text-xs text-center text-text-tertiary-light dark:text-text-tertiary-dark max-w-[40rem]">
              <strong className="text-btn-danger-bg">IMPORTANT:</strong> If the
              provided course does not include an existing transcript, a new one
              will be generated. This process{" "}
              <u className="text-btn-warning-bg-hover dark:text-btn-warning-bg/90">
                may consume additional resources
              </u>{" "}
              and increase the total processing time.
            </div>
          )}
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
          <div className="flex flex-row items-start justify-start mb-4">
            <div className="w-[50%] flex flex-col items-end">
              <span className="mb-2 underline underline-offset-2 text-text-secondary-light dark:text-text-secondary-dark">
                Formats
              </span>
              <Input
                type="checkbox"
                label="SubRip Subtitle (.srt)"
                checked={checkboxVttContent}
                onChange={() => setIncludeVttContent(!checkboxVttContent)}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
              <Input
                type="checkbox"
                label="Plain Text (.txt)"
                checked={checkboxPlainText}
                onChange={() => setCheckboxPlainText(!checkboxPlainText)}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
              <Input
                type="checkbox"
                label="Class Audio (.m4a)"
                checked={checkboxAudio}
                onChange={() => setCheckboxAudio(!checkboxAudio)}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
            </div>
            <div className="w-[50%] flex flex-col items-end">
              <div className="relative flex items-center mb-2">
                <Tooltip message="Recommended only if you have a modern Nvidia GPU">
                  <div className="peer flex relative me-2">
                    <Icon
                      iconName="info"
                      className="text-btn-warning-bg/90 pointer-events-auto animate-pulse"
                    />
                    <div className="absolute w-full h-full bg-btn-warning-bg-hover/25 rounded-full animate-ping pointer-events-none"></div>
                  </div>
                </Tooltip>
                <span className="text-btn-warning-bg-hover dark:text-btn-warning-bg/90 underline underline-offset-2">
                  Experimental
                </span>
              </div>
              <Input
                type="checkbox"
                label="Autogenerate Content"
                checked={checkboxForceVttContent}
                onChange={() =>
                  setCheckboxForceVttContent(!checkboxForceVttContent)
                }
                disabled={appIsWaiting}
              />
            </div>
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
              (!checkboxVttContent && !checkboxPlainText && !checkboxAudio)
            }
            isLoading={appIsWaiting}
          >
            Start Scraping
            <Icon iconName="manufacturing" />
          </Button>
        </form>
      </Card>
      <code className="text-base w-full text-center my-4 mb-16 text-text-tertiary-light dark:text-text-tertiary-dark">
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
              currStatus === AppStatus.ERROR_WHILE_SAVING ||
              currStatus === AppStatus.ERROR_WHILE_GETTING_URLS
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
