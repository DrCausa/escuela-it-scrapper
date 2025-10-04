import { api } from "@services/api";
import type { ResultResponse } from "@services/api/types";

export const getTexttrackUrl = async (url: string): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await api
      .post("/get-texttrack-url", { url: url })
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
    const response: ResultResponse = await api
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
    const response: ResultResponse = await api
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
    const response: ResultResponse = await api
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
