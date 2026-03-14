import { useState, useMemo } from "preact/hooks";
import type { HttpMethod, RequestHistoryItem, RequestResult } from "./types";
import { formatDateTime } from "../../utils/format";

export type RequestPageProps = {
  history: RequestHistoryItem[];
  onChange: (history: RequestHistoryItem[]) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

export function RequestPage({ history, onChange }: RequestPageProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://api.github.com/users/github");
  const [headers, setHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<RequestResult>({ loading: false, data: undefined });
  const [activeTab, setActiveTab] = useState<"response" | "headers" | "history">("response");

  const sendRequest = async () => {
    if (!url.trim()) return;

    const startTime = Date.now();
    setResult({ loading: true, data: undefined });

    const historyItem: RequestHistoryItem = {
      id: createId(),
      method,
      url: url.trim(),
      headers: headers.trim() || undefined,
      body: body.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    try {
      const parsedHeaders = headers.trim() ? JSON.parse(headers) : {};
      const options: RequestInit = {
        method,
        headers: parsedHeaders
      };

      if (body.trim() && !["GET", "HEAD"].includes(method)) {
        options.body = body.trim();
      }

      const resp = await fetch(url.trim(), options);
      const duration = Date.now() - startTime;

      let data: unknown;
      const contentType = resp.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await resp.json();
      } else {
        data = await resp.text();
      }

      const headersObj: Record<string, string> = {};
      resp.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      setResult({
        loading: false,
        status: resp.status,
        statusText: resp.statusText,
        headers: headersObj,
        data,
        duration
      });

      onChange([
        {
          ...historyItem,
          status: resp.status,
          duration
        },
        ...history
      ].slice(0, 50));
    } catch (error) {
      const duration = Date.now() - startTime;
      setResult({
        loading: false,
        error: error instanceof Error ? error.message : "请求失败",
        duration
      });
      onChange([
        {
          ...historyItem,
          status: 0,
          duration
        },
        ...history
      ].slice(0, 50));
    }
  };

  const statusColor = useMemo(() => {
    if (!result.status) return "text-slate-400";
    if (result.status >= 200 && result.status < 300) return "text-emerald-400";
    if (result.status >= 300 && result.status < 400) return "text-amber-400";
    return "text-rose-400";
  }, [result.status]);

  const formatJson = (data: unknown) => {
    if (typeof data === "string") return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">模拟请求</h2>
            <p className="mt-1 text-sm text-slate-300">HTTP 请求测试与调试工具</p>
          </div>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex gap-3">
            <select
              value={method}
              onInput={(e) => setMethod((e.target as HTMLSelectElement).value as HttpMethod)}
              className="w-28 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              value={url}
              onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="输入请求 URL"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            />
            <button
              onClick={sendRequest}
              disabled={result.loading}
              className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:opacity-50"
            >
              {result.loading ? "发送中..." : "发送"}
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400">请求头 (JSON)</label>
            <textarea
              value={headers}
              onInput={(e) => setHeaders((e.target as HTMLTextAreaElement).value)}
              placeholder='{"Content-Type": "application/json"}'
              rows={4}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-400"
            />
          </div>

          {!["GET", "HEAD"].includes(method) && (
            <div>
              <label className="text-xs text-slate-400">请求体</label>
              <textarea
                value={body}
                onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)}
                placeholder='{"key": "value"}'
                rows={6}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setActiveTab("response")}
                className={`rounded-full border px-3 py-1 transition ${
                  activeTab === "response"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                响应
              </button>
              <button
                onClick={() => setActiveTab("headers")}
                className={`rounded-full border px-3 py-1 transition ${
                  activeTab === "headers"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                响应头
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`rounded-full border px-3 py-1 transition ${
                  activeTab === "history"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                历史 ({history.length})
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "response" && (
                <div>
                  {result.loading ? (
                    <p className="text-sm text-slate-300">请求中...</p>
                  ) : result.error ? (
                    <p className="text-sm text-rose-300">{result.error}</p>
                  ) : result.data ? (
                    <>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`font-semibold ${statusColor}`}>
                          {result.status} {result.statusText}
                        </span>
                        <span className="text-slate-400">{result.duration}ms</span>
                      </div>
                      <pre className="mt-3 max-h-96 overflow-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
                        {formatJson(result.data)}
                      </pre>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">发送请求后查看响应</p>
                  )}
                </div>
              )}

              {activeTab === "headers" && (
                <div>
                  {result.headers ? (
                    <pre className="max-h-96 overflow-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
                      {Object.entries(result.headers)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n")}
                    </pre>
                  ) : (
                    <p className="text-sm text-slate-400">暂无响应头数据</p>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-400">暂无请求历史</p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                item.method === "GET"
                                  ? "bg-sky-400/20 text-sky-200"
                                  : item.method === "POST"
                                  ? "bg-emerald-400/20 text-emerald-200"
                                  : item.method === "DELETE"
                                  ? "bg-rose-400/20 text-rose-200"
                                  : "bg-amber-400/20 text-amber-200"
                              }`}
                            >
                              {item.method}
                            </span>
                            <span className={`text-sm ${item.status && item.status >= 200 && item.status < 300 ? "text-emerald-400" : "text-slate-400"}`}>
                              {item.status || "--"}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-400">{item.url}</p>
                          <p className="text-xs text-slate-500">{formatDateTime(new Date(item.timestamp))}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.duration && (
                            <span className="text-xs text-slate-500">{item.duration}ms</span>
                          )}
                          <button
                            onClick={() => {
                              setMethod(item.method);
                              setUrl(item.url);
                              if (item.headers) setHeaders(item.headers);
                              if (item.body) setBody(item.body);
                            }}
                            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/20"
                          >
                            重用
                          </button>
                          <button
                            onClick={() => onChange(history.filter((h) => h.id !== item.id))}
                            className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/20"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white">快速测试</h3>
          <p className="mt-1 text-sm text-slate-300">常用测试接口</p>
          <div className="mt-4 space-y-2">
            {[
              { method: "GET", url: "https://api.github.com/users/github", label: "GitHub 用户 API" },
              { method: "GET", url: "https://jsonplaceholder.typicode.com/posts/1", label: "JSONPlaceholder 文章" },
              { method: "GET", url: "https://api.coindesk.com/v1/bpi/currentprice.json", label: "比特币价格" },
              { method: "GET", url: "https://api.sunrise-sunset.org/json?lat=35.6762&lng=139.6503", label: "日出日落时间" },
            ].map((item) => (
              <button
                key={item.url}
                onClick={() => {
                  setMethod(item.method as HttpMethod);
                  setUrl(item.url);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 text-left text-sm text-slate-200 transition hover:bg-white/10"
              >
                <span>{item.label}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{item.method}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white">提示</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>支持 GET、POST、PUT、DELETE、PATCH 等 HTTP 方法。</li>
            <li>请求头和请求体支持 JSON 格式。</li>
            <li>响应自动识别 JSON 或纯文本格式。</li>
            <li>请求历史最多保留 50 条记录。</li>
            <li>部分 API 可能受跨域限制，需服务端代理。</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
