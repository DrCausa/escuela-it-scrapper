import { api } from "@services/api";

export const scrape = async (url: string): Promise<any> => {
  try {
    const { data } = await api.post("/scrape", { url });
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const get_content = async (
  hasTime: boolean,
  url: string,
  format: "txt" | "srt" | "summary" = "txt"
): Promise<any> => {
  try {
    const { data } = await api.post("/get-content", { hasTime, url, format });
    return data;
  } catch (err) {
    return { status: "error", message: err };
  }
};
