import { geminiApi } from "@services/api";
import type { ResultResponse } from "@services/api/types";

export const formatPlainText = async (
  plainText: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await geminiApi
      .post("/api/format-plain-text", { plainText })
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

export const formatVTTContent = async (
  vttContent: string
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await geminiApi
      .post("/api/format-vtt-content", { vttContent })
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
