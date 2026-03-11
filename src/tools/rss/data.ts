import type { BoardData, ToolCard } from "../types";
import type { RssFeed } from "./types";

export const rssCard: ToolCard = {
  key: "rss",
  name: "RSS 订阅",
  desc: "保存订阅源并阅读列表",
  status: "本地",
  accent: "from-amber-400/30 via-amber-400/10 to-transparent"
};

export function buildRssBoard(feeds: RssFeed[], selected?: RssFeed): BoardData {
  return {
    title: "RSS 订阅 · 数据版",
    rows: [
      { label: "订阅源", value: `${feeds.length}` },
      { label: "当前查看", value: selected?.name || "--" },
      { label: "最近添加", value: feeds[0]?.name || "--" }
    ]
  };
}
