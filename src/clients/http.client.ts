import { sleep } from "../utils/sleep.";
import { ApiErrorSchema, ApiErrorType } from "./error";

type APIFetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
  retryConfig?: {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    retryOnStatusCodes?: number[];
  };
};

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

if (!API_KEY) {
  throw new Error("API_KEY is not defined");
}

export const apiFetch = async <T>(
  endpoint: string,
  options: APIFetchOptions
): Promise<T> => {
  const { params, retryConfig, ...restOptions } = options;

  const maxRetries = retryConfig?.maxRetries || 3;
  const initialDelay = retryConfig?.initialDelay || 1000;
  const maxDelay = retryConfig?.maxDelay || 5000;
  const retryOnStatusCodes = retryConfig?.retryOnStatusCodes || [
    408, 429, 500, 502, 503, 504,
  ];

  let fullUrl = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const paramsString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    );
    fullUrl += `?${paramsString}`;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(fullUrl, {
        ...restOptions,
        headers: {
          ...restOptions.headers,
          "x-api-key": API_KEY,
        },
      });

      const responseJson = await response.json().catch(() => {});

      if (response.ok) return responseJson as T;

      //handle errors
      //Check if error returns json matching ApiErrorSchema
      const parsedErrorData = ApiErrorSchema.safeParse(responseJson);

      const errorData: ApiErrorType = parsedErrorData.success
        ? parsedErrorData.data
        : {
            error: "Unknown Error",
            message: "An unknown error occurred",
          };

      console.log(`Error making request to ${fullUrl} :`, errorData);

      const shouldRetry = retryOnStatusCodes.includes(response.status);

      if (!shouldRetry || attempt === maxRetries)
        throw new Error(errorData.message || `API Error : ${response.status}`);

      let delay = initialDelay * Math.pow(2, attempt);
      //Check if errorData has retry_after
      if (errorData.retry_after) {
        delay = errorData.retry_after * 1000;
      } else {
        //Check if response header has retry-after
        const retryAfterHeader = response.headers.get("retry-after");
        if (retryAfterHeader) {
          const parsedDelay = isNaN(Number(retryAfterHeader))
            ? Date.parse(retryAfterHeader) - Date.now()
            : Number(retryAfterHeader) * 1000;

          if (!isNaN(parsedDelay)) {
            delay = parsedDelay;
          }
        }
      }

      //Cap delay and add random jitter
      delay = Math.min(delay, maxDelay) + Math.random() * 100;
      await sleep(delay);
    } catch (error) {
      console.error(
        `Request to ${fullUrl} failed on attempt ${attempt + 1}:`,
        error
      );
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  throw new Error(`Request to ${fullUrl} failed after max retries`);
};
