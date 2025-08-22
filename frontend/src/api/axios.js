import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const apiAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
