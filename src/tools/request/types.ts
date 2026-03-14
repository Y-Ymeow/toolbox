export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export type RequestHistoryItem = {
  id: string;
  method: HttpMethod;
  url: string;
  headers?: string;
  body?: string;
  timestamp: string;
  status?: number;
  duration?: number;
};

export type RequestResult = {
  loading: boolean;
  error?: string;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: unknown;
  duration?: number;
};
