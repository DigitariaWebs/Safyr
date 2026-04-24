import { createFetcher } from "./fetch";

const DEFAULT_ORIGIN = "http://localhost:4000";
const origin = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_ORIGIN;
const baseURL = `${origin.replace(/\/$/, "")}/api`;

export const apiFetch = createFetcher(baseURL);
