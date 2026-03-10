import type { BoardData, ToolCard } from "../types";
import type { NewsState } from "../../utils/news";

export const newsCard: ToolCard = {
  key: "news",
  name: "新闻源",
  desc: "国内资讯聚合与摘要",
  status: "滚动",
  accent: "from-emerald-400/30 via-emerald-400/10 to-transparent"
};

export function buildNewsBoard(news: NewsState): BoardData {
  return {
    title: "新闻源 · 数据版",
    rows: [
      { label: "频道", value: news.feedName },
      { label: "最新条目", value: news.items[0]?.title ?? "--" },
      { label: "条数", value: `${news.items.length}` }
    ]
  };
}
