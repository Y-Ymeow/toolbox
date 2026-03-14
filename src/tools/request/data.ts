import type { BoardData, ToolCard } from "../types";
import type { RequestHistoryItem } from "./types";

export const requestCard: ToolCard = {
  key: "request",
  name: "模拟请求",
  desc: "HTTP 请求测试与调试",
  status: "跨域",
  accent: "from-emerald-400/30 via-emerald-400/10 to-transparent"
};

export function buildRequestBoard(history: RequestHistoryItem[]): BoardData {
  const lastRequest = history[0];
  return {
    title: "模拟请求 · 数据版",
    rows: [
      { label: "请求数", value: history.length.toString() },
      { label: "最近请求", value: lastRequest ? `${lastRequest.method} ${lastRequest.url.slice(0, 30)}` : "--" },
      { label: "最近状态", value: lastRequest?.status ? `${lastRequest.status}` : "--" }
    ]
  };
}
