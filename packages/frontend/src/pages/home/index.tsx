import Button from "@components/commons/Button";
import Card from "@components/commons/Card";
import Icon from "@components/commons/Icon";
import { useNotify } from "@contexts/NotificationContext";
import { useTheme } from "@hooks/useTheme";
import {
  generateVTTContent,
  getM3u8Url,
  getTexttrackUrl,
  getVttContent,
  isValidEscuelaITUrl,
  saveAudioUsingM3u8Url,
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
import {
  formatPlainText,
  formatVTTContent,
} from "@/services/api/controllers/geminiController";
import { usePersistedState } from "@/hooks/usePersistedState";

interface AppStatus {
  message: string;
  type: string;
  animation?: string;
}

const APP_STATUS = {
  IDLE: {
    message: "Waiting for URL...",
    type: "default",
  },
  READY_TO_SCRAPE: {
    message: "Ready to scrape!",
    type: "primary",
    animation: "animate-pulse",
  },
  LOADING_USER_PROFILE: {
    message: "Loading user profile...",
    type: "warning",
    animation: "animate-pulse",
  },
  GETTING_TEXT_TRACK_URL: {
    message: "Getting text track URL...",
    type: "warning",
    animation: "animate-pulse",
  },
  GETTING_M3U8_AUDIO_URL: {
    message: "Getting audio m3u8 URL...",
    type: "warning",
    animation: "animate-pulse",
  },
  GETTING_CLASS_AUDIO: {
    message: "Getting class audio in .m4a format...",
    type: "warning",
    animation: "animate-pulse",
  },
  GETTING_VTT_CONTENT: {
    message: "Getting existing VTT content...",
    type: "warning",
    animation: "animate-pulse",
  },
  GENERATING_VTT_CONTENT: {
    message: "Generating new VTT content...",
    type: "warning",
    animation: "animate-pulse",
  },
  CONVERTING_TO_PLAIN_TEXT: {
    message: "Converting to plain text...",
    type: "warning",
    animation: "animate-pulse",
  },
  FORMATTING_PLAIN_TEXT_USING_GEMINI: {
    message: "Formatting plain text using Gemini...",
    type: "warning",
    animation: "animate-pulse",
  },
  FORMATTING_VTT_CONTENT_USING_GEMINI: {
    message: "Formatting VTT content using Gemini...",
    type: "warning",
    animation: "animate-pulse",
  },
  SAVING_TO_HISTORY: {
    message: "Saving to history...",
    type: "warning",
    animation: "animate-pulse",
  },
  FULL_SCRAPE_SUCCESS: {
    message: "Scraping completed successfully!",
    type: "success",
  },
  ERROR_WHILE_SAVING: {
    message: "Error while saving to history!",
    type: "error",
  },
  ERROR_WHILE_GETTING_AUDIO: {
    message: "Error while getting audio!",
    type: "error",
  },
  ERROR_WHILE_GETTING_VTT_CONTENT: {
    message: "Error while getting existing VTT content!",
    type: "error",
  },
  ERROR_WHILE_GENERATING_VTT: {
    message: "Error while generating new VTT content!",
    type: "error",
  },
  ERROR_WHILE_GETTING_URLS: {
    message: "An error occurred while trying to get the resource URLs!",
    type: "error",
  },
  ERROR_WHILE_CONVERTING_TO_PLAIN_TEXT: {
    message: "An error occurred while converting to plain text",
    type: "error",
  },
  ERROR_WHILE_FORMATTING_USING_GEMINI: {
    message: "An error occurred while trying to format using gemini!",
    type: "error",
  },
  ERROR_WHILE_GETTING_DATA: {
    message: "Error while getting data!",
    type: "error",
  },
  GENERIC_ERROR: {
    message: "An error occurred...",
    type: "error",
  },
  INVALID_PROVIDED_URL: {
    message: "The provided URL is not valid!",
    type: "error",
  },
} as const;

type APP_STATUS = (typeof APP_STATUS)[keyof typeof APP_STATUS];

const HomePage = () => {
  usePageTitle("Home");
  useTheme();

  const { setNotify } = useNotify();
  const [currStatus, setCurrStatus] = useState<AppStatus>(APP_STATUS.IDLE);
  const [appIsWaiting, setAppIsWaiting] = useState(false);
  const [url, setUrl] = useState("");

  const [addVTTContent, setAddVTTContent] = usePersistedState(
    "addVTTContent",
    true
  );
  const [addPlainText, setAddPlainText] = usePersistedState(
    "addPlainText",
    true
  );
  const [addAudio, setAddAudio] = usePersistedState("addAudio", false);
  const [addFormattedPlainText, setAddFormattedPlainText] = usePersistedState(
    "addFormattedPlainText",
    false
  );
  const [addFormattedVTTContent, setAddFormattedVTTContent] = usePersistedState(
    "addFormattedVTTContent",
    false
  );
  const [forceVTTContent, setForceVTTContent] = usePersistedState(
    "forceVTTContent",
    false
  );

  const getUrlCourse = (): string | any => {
    const match = url.match(/https:\/\/escuela.it\/cursos\/(.+)\/clase\/(.+)/);
    return match ? match[1] : null;
  };

  const getUrlClass = (): string | any => {
    const match = url.match(/https:\/\/escuela.it\/cursos\/(.+)\/clase\/(.+)/);
    return match ? match[2] : null;
  };

  const handleClick = async () => {
    setAppIsWaiting(true);

    let texttrackUrl = null,
      m3u8Url = null;

    let vttContent = "",
      plainText = "",
      audioFileName = "",
      formattedPlainText = "",
      formattedVTTContent = "";

    let vttGeneratedAt = 0,
      plainTextGeneratedAt = 0,
      audioGeneratedAt = 0,
      formattedPlainTextGeneratedAt = 0,
      formattedVTTContentGeneratedAt = 0;

    let newData: Data = [];

    // get text track url if is required
    if (
      addVTTContent ||
      addPlainText ||
      addFormattedPlainText ||
      addFormattedVTTContent
    ) {
      setCurrStatus(APP_STATUS.GETTING_TEXT_TRACK_URL);
      texttrackUrl = await extractTexttrackUrl();
    }

    // get m3u8 audio url if is required
    if ((texttrackUrl === null && forceVTTContent) || addAudio) {
      setCurrStatus(APP_STATUS.GETTING_M3U8_AUDIO_URL);
      m3u8Url = await extractM3u8Url();
    }

    // get vtt content of provided url if its required and possible
    if (
      texttrackUrl !== null &&
      (addVTTContent ||
        addPlainText ||
        addFormattedPlainText ||
        addFormattedVTTContent)
    ) {
      setCurrStatus(APP_STATUS.GETTING_VTT_CONTENT);

      vttGeneratedAt = Date.now();
      const response = await getVttContent(texttrackUrl);

      if (response.status === "error" && !forceVTTContent) {
        setCurrStatus(APP_STATUS.ERROR_WHILE_GETTING_VTT_CONTENT);
        return;
      }

      vttContent = (response.result as string) ?? "";
    }

    // get class audio in m4a format
    if ((addAudio || (!vttContent && forceVTTContent)) && m3u8Url !== null) {
      setCurrStatus(APP_STATUS.GETTING_CLASS_AUDIO);

      audioGeneratedAt = Date.now();
      const filename = `${getUrlCourse()}-${getUrlClass()}-${formateDateForFileName(
        audioGeneratedAt
      )}-class_audio`;
      const response = await saveAudioUsingM3u8Url(m3u8Url, filename);

      if (response.status === "error") {
        setCurrStatus(APP_STATUS.ERROR_WHILE_GETTING_AUDIO);
        return;
      }

      audioFileName = (response.result as string) ?? "";
    }

    // generate vtt content if its required
    if (!vttContent && forceVTTContent && audioFileName) {
      setCurrStatus(APP_STATUS.GENERATING_VTT_CONTENT);

      vttGeneratedAt = Date.now();
      const response = await generateVTTContent(audioFileName);

      if (response.status === "error" && !forceVTTContent) {
        setCurrStatus(APP_STATUS.ERROR_WHILE_GENERATING_VTT);
        return;
      }

      vttContent = (response.result as string) ?? "";
    }

    // get plain text version of vtt content if its required and possible
    if (vttContent && (addPlainText || addFormattedPlainText)) {
      setCurrStatus(APP_STATUS.CONVERTING_TO_PLAIN_TEXT);
      plainTextGeneratedAt = Date.now();
      const response = await vvtToPlainText(vttContent);

      if (response.status === "error") {
        setCurrStatus(APP_STATUS.ERROR_WHILE_CONVERTING_TO_PLAIN_TEXT);
        return;
      }

      plainText = (response.result as string) ?? "";
    }

    // get gemini format using plain text
    if (addFormattedPlainText && plainText) {
      setCurrStatus(APP_STATUS.FORMATTING_PLAIN_TEXT_USING_GEMINI);
      formattedPlainTextGeneratedAt = Date.now();
      const response = await formatPlainText(plainText);

      if (response.status === "error") {
        setCurrStatus(APP_STATUS.ERROR_WHILE_FORMATTING_USING_GEMINI);
        return;
      }

      formattedPlainText = (response.result as string) ?? "";
    }

    // get gemini format using vtt content
    if (addFormattedVTTContent && vttContent) {
      setCurrStatus(APP_STATUS.FORMATTING_VTT_CONTENT_USING_GEMINI);
      formattedVTTContentGeneratedAt = Date.now();
      const response = await formatVTTContent(vttContent);

      if (response.status === "error") {
        setCurrStatus(APP_STATUS.ERROR_WHILE_FORMATTING_USING_GEMINI);
        return;
      }

      formattedVTTContent = (response.result as string) ?? "";
    }

    // no data error
    if (!vttContent && !plainText && !audioFileName) {
      setAppIsWaiting(false);
      setCurrStatus(APP_STATUS.ERROR_WHILE_GETTING_DATA);
      return;
    }

    // save vtt content to history in srt format
    if (addVTTContent && vttContent) {
      const id = crypto.randomUUID();
      const newRow: DataRow = {
        id: id,
        generated_at: vttGeneratedAt,
        content: vttContent,
        file_name: `${getUrlCourse()}-${getUrlClass()}-${formateDateForFileName(
          vttGeneratedAt
        )}-vtt_content.srt`,
      };
      newData.push(newRow);
    }

    // save plain text to history in txt format
    if (addPlainText && plainText) {
      const id = crypto.randomUUID();
      const newRow: DataRow = {
        id: id,
        generated_at: plainTextGeneratedAt,
        content: plainText,
        file_name: `${getUrlCourse()}-${getUrlClass()}-${formateDateForFileName(
          plainTextGeneratedAt
        )}-plain_text.txt`,
      };
      newData.push(newRow);
    }

    // save formatted plain text in txt format
    if (addFormattedPlainText && formattedPlainText) {
      const id = crypto.randomUUID();
      const newRow: DataRow = {
        id: id,
        generated_at: formattedPlainTextGeneratedAt,
        content: formattedPlainText,
        file_name: `${getUrlCourse()}-${getUrlClass()}-${formateDateForFileName(
          formattedPlainTextGeneratedAt
        )}-formatted_plain_text.txt`,
      };
      newData.push(newRow);
    }

    // save formatted vtt content in txt format
    if (addFormattedVTTContent && formattedVTTContent) {
      const id = crypto.randomUUID();
      const newRow: DataRow = {
        id: id,
        generated_at: formattedVTTContentGeneratedAt,
        content: formattedVTTContent,
        file_name: `${getUrlCourse()}-${getUrlClass()}-${formateDateForFileName(
          formattedVTTContentGeneratedAt
        )}-formatted_vtt_content.txt`,
      };
      newData.push(newRow);
    }

    // save audio to history in m4a format
    if (addAudio && audioFileName) {
      const id = crypto.randomUUID();
      const newRow: DataRow = {
        id: id,
        generated_at: audioGeneratedAt,
        content: plainText,
        file_name: audioFileName,
        is_audio: true,
      };
      newData.push(newRow);
    }

    // save new data to history if exists
    if (newData.length > 0) {
      setCurrStatus(APP_STATUS.SAVING_TO_HISTORY);

      try {
        for (const row of newData) {
          const response = await addToHistory(row);
          if (response.status !== "success") {
            setAppIsWaiting(false);
            setCurrStatus(APP_STATUS.ERROR_WHILE_SAVING);
            return;
          }
        }
      } catch (err) {
        setAddAudio(false);
        setCurrStatus(APP_STATUS.ERROR_WHILE_SAVING);
        return;
      }
    }

    playSound("mp3");
    setNotify("/history", true);
    setAppIsWaiting(false);
    setCurrStatus(APP_STATUS.FULL_SCRAPE_SUCCESS);
  };

  const extractTexttrackUrl = async (): Promise<string | null> => {
    const response = await getTexttrackUrl(url);
    return response.result === false && (!addAudio || !forceVTTContent)
      ? null
      : `${response.result}`;
  };

  const extractM3u8Url = async (): Promise<string | null> => {
    const response = await getM3u8Url(url);
    return response.result === false ? null : `${response.result}`;
  };

  const changeURL = async (newUrl: string) => {
    let newStatus: APP_STATUS;

    if (newUrl.trim() === "") {
      newStatus = APP_STATUS.IDLE;
    } else {
      const response: ResultResponse = await isValidEscuelaITUrl(newUrl);

      if (response.result === true) {
        newStatus = APP_STATUS.READY_TO_SCRAPE;
      } else {
        newStatus = APP_STATUS.INVALID_PROVIDED_URL;
      }
    }

    setCurrStatus(newStatus);
    setUrl(newUrl);
  };

  const readableAppStatus = () => {
    let statusClassName = "";
    switch (currStatus.type) {
      case "warning":
        statusClassName = "text-btn-warning-bg";
        break;
      case "error":
        statusClassName = "text-btn-danger-bg";
        break;
      case "success":
        statusClassName = "text-btn-success-bg";
        break;
      case "primary":
        statusClassName = "text-btn-primary-bg";
        break;
      default:
        statusClassName = "";
        break;
    }
    return (
      <span
        className={flattenClasses(
          `${statusClassName} ${currStatus.animation ?? ""}`
        )}
      >
        {currStatus.message}
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      <Card className="w-[32rem] mx-auto mt-15 flex flex-col">
        <h5 className="text-center text-[32px] mb-6">EscuelaIT Scrapper</h5>
        <div className="flex flex-col items-center mb-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Provide an URL:
        </div>
        <div
          className={flattenClasses(`
            text-center text-xs text-text-tertiary-light dark:text-text-tertiary-dark max-w-[40rem] overflow-hidden transition-all duration-300 ease-in-out
            ${
              forceVTTContent
                ? "max-h-96 mb-4 opacity-100"
                : "max-h-0 opacity-0"
            }
          `)}
        >
          <strong className="text-btn-danger-bg">IMPORTANT:</strong> If the
          provided course does not include an existing transcript, a new one
          will be generated. This process{" "}
          <u className="text-btn-warning-bg-hover dark:text-btn-warning-bg/90">
            may consume additional resources
          </u>{" "}
          and increase the total processing time.
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
            type="url"
            layoutClassName="mb-4"
            disabled={appIsWaiting}
          />
          <div className="flex flex-row items-start justify-start mb-4 gap-5">
            <div className="w-[50%] flex flex-col items-start">
              <span className="mb-4 text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                <Icon iconName="instant_mix" />
                Formats
              </span>
              <Input
                type="checkbox"
                label="SubRip Subtitle (.srt)"
                checked={addVTTContent}
                onChange={() => {
                  setAddVTTContent(!addVTTContent);
                }}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
              <Input
                type="checkbox"
                label="Plain Text (.txt)"
                checked={addPlainText}
                onChange={() => {
                  setAddPlainText(!addPlainText);
                }}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
              <Input
                type="checkbox"
                label="Class Audio (.m4a)"
                checked={addAudio}
                onChange={() => {
                  setAddAudio(!addAudio);
                }}
                disabled={appIsWaiting}
                layoutClassName="mb-2"
              />
            </div>
            <div className="w-[50%] flex flex-col items-start">
              <span className="text-text-secondary-light dark:text-text-secondary-dark mb-4 flex items-center gap-1">
                <div className="relative flex">
                  <Icon
                    iconName="experiment"
                    className="animate-pulse text-btn-warning-bg/90"
                  />
                  <div className="w-[12px] h-[12px] left-[50%] top-[60%] -translate-x-[50%] -translate-y-[50%] absolute bg-btn-warning-bg/25 rotate-45 animate-ping rounded-sm"></div>
                </div>
                Experimental
              </span>
              <div className="relative flex mb-2 gap-2 group w-full">
                <Tooltip
                  message="Recommended only if you have a modern Nvidia GPU"
                  className="w-full justify-end"
                >
                  <Input
                    type="checkbox"
                    label="Try Generate VTT Content"
                    checked={forceVTTContent}
                    onChange={() => setForceVTTContent(!forceVTTContent)}
                    disabled={appIsWaiting}
                    checkboxClassName="group-hover:!border-btn-warning-bg/90 group-hover:animate-pulse transition-all duration-300"
                    labelCheckboxClassName="group-hover:!text-btn-warning-bg/90 transition-all duration-300"
                    innerCheckboxClassName="group-hover:!bg-btn-warning-bg/90"
                  />
                </Tooltip>
              </div>
              <div className="relative flex gap-2 group w-full mb-2">
                <Tooltip
                  message="This option uses the gemini-2.5-flash model, so you'll need a Gemini API KEY"
                  className="w-full justify-end"
                >
                  <Input
                    type="checkbox"
                    label="Gemini Format"
                    checked={addFormattedPlainText}
                    onChange={() => {
                      setAddFormattedPlainText(!addFormattedPlainText);
                    }}
                    disabled={appIsWaiting}
                    checkboxClassName="group-hover:!border-btn-warning-bg/90 group-hover:animate-pulse transition-all duration-300"
                    labelCheckboxClassName="group-hover:!text-btn-warning-bg/90 transition-all duration-300"
                    innerCheckboxClassName="group-hover:!bg-btn-warning-bg/90"
                  />
                </Tooltip>
              </div>
              <div className="relative flex gap-2 group w-full">
                <Tooltip
                  message="This format include timestamps of VTT file content"
                  className="w-full justify-end"
                >
                  <Input
                    type="checkbox"
                    label="Gemini Format (timestamps)"
                    checked={addFormattedVTTContent}
                    onChange={() => {
                      setAddFormattedVTTContent(!addFormattedVTTContent);
                    }}
                    disabled={appIsWaiting}
                    checkboxClassName="group-hover:!border-btn-warning-bg/90 group-hover:animate-pulse transition-all duration-300"
                    labelCheckboxClassName="group-hover:!text-btn-warning-bg/90 transition-all duration-300 truncate"
                    innerCheckboxClassName="group-hover:!bg-btn-warning-bg/90"
                  />
                </Tooltip>
              </div>
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
              appIsWaiting ||
              currStatus === APP_STATUS.INVALID_PROVIDED_URL ||
              currStatus == APP_STATUS.IDLE ||
              (!addVTTContent &&
                !addPlainText &&
                !addAudio &&
                !addFormattedPlainText &&
                !addFormattedVTTContent)
            }
            isLoading={appIsWaiting}
          >
            Start Scraping
            <Icon iconName="manufacturing" />
          </Button>
        </form>
      </Card>
      <code className="max-w-[25rem] mx-auto text-base w-full text-center my-2 mb-16 text-text-tertiary-light dark:text-text-tertiary-dark">
        &lt; {readableAppStatus()} &#47;&gt;
      </code>
    </div>
  );
};

export default HomePage;
