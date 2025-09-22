import { api } from "@services/api";
import type { DataType } from "../types/DataType";
import type { DataResponseType } from "../types/DataResultType";

export const getData = async (): Promise<DataResponseType> => {
  try {
    const { data } = await api.get("/get-results");
    if (data.status === "error") {
      return {
        status: "error",
        message: data.message,
      };
    }
    return {
      status: "success",
      result: data.result,
    };
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};

export const setData = async (newData: DataType): Promise<DataResponseType> => {
  try {
    const { data } = await api.post("/save-results", { newData });
    return {
      status: data.status,
      message: data.message,
    };
  } catch (err) {
    return {
      status: "error",
      message: String(err),
    };
  }
};
