import { scrappingApi } from "@services/api";
import type { Data, DataRow, ResultResponse } from "@services/api/types";

export const getHistory = async (): Promise<ResultResponse | Data> => {
  try {
    const response: ResultResponse = await scrappingApi
      .get("/get-history")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);

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

export const addToHistory = async (
  newRow: DataRow
): Promise<ResultResponse> => {
  try {
    const response: ResultResponse = await scrappingApi
      .post("/add-to-history", { value: newRow })
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
