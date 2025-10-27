import { scrappingApi } from "@services/api";
import type { ResultResponse } from "@services/api/types";

export const getTexttrackUrl = async (url: string): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/get-texttrack-url", { url })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const getVttContent = async (
  texttrackUrl: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/get-vtt-content", { url: texttrackUrl })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const vvtToPlainText = async (
  vvtContent: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/vvt-to-plain-text", {
        value: vvtContent,
      })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const isValidEscuelaITUrl = async (
  url: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/is-valid-escuelait-url", { url })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const getM3u8Url = async (url: string): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/get-m3u8-url", { url })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const saveAudioUsingM358Url = async (
  url: string,
  file_name: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/save-audio-using-m3u8-url", { url, file_name })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const downloadSavedAudio = async (
  fileName: string
): Promise<Blob | ResultResponse> => {
  try {
    const response: Blob = await scrappingApi
      .post(
        "/download-saved-audio",
        { file_name: fileName },
        { responseType: "blob" }
      )
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const generateVttContent = async (
  fileName: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/generate-vtt-content", { file_name: fileName })
      .then((res) => res.data)
      .catch((err) => {
        return {
          status: "error",
          message: String(err),
        };
      });
    return response;
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};
