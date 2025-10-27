import axios from "axios";

export const scrappingApi = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const geminiApi = axios.create({
  baseURL: "http://127.0.0.1:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
