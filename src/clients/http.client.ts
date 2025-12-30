type APIFetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
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
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "x-api-key": API_KEY,
    },
  });

  return response.json() as Promise<T>;
};
