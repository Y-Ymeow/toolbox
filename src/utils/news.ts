import { useEffect, useState } from "preact/hooks";

export type NewsItem = {
  title: string;
  link: string;
  pubDate?: string;
  summary?: string;
};

export type NewsState = {
  loading: boolean;
  error?: string;
  feedName: string;
  items: NewsItem[];
  updatedAt?: string;
};

export const newsFeeds = [
  { label: "中央社 · 政治", url: "https://feeds.feedburner.com/rsscna/politics" },
  { label: "中央社 · 国际", url: "https://feeds.feedburner.com/rsscna/intworld" },
  { label: "中央社 · 两岸", url: "https://feeds.feedburner.com/rsscna/mainland" },
  { label: "中央社 · 科技", url: "https://feeds.feedburner.com/rsscna/technology" },
  { label: "中央社 · 生活", url: "https://feeds.feedburner.com/rsscna/lifehealth" }
];

export function useNews(feedUrl: string, feedName: string) {
  const [state, setState] = useState<NewsState>({
    loading: true,
    feedName,
    items: []
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState({ loading: true, feedName, items: [] });
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
        const resp = await fetch(proxyUrl);
        if (!resp.ok) throw new Error("新闻源获取失败");
        const text = await resp.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).slice(0, 10);
        const parsed = items.map((item) => ({
          title: item.querySelector("title")?.textContent?.trim() || "(无标题)",
          link: item.querySelector("link")?.textContent?.trim() || "",
          pubDate: item.querySelector("pubDate")?.textContent?.trim() || undefined,
          summary: item.querySelector("description")?.textContent?.trim() || undefined
        }));
        if (!active) return;
        setState({
          loading: false,
          feedName,
          items: parsed,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          feedName,
          items: [],
          error: error instanceof Error ? error.message : "未知错误"
        });
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [feedUrl, feedName]);

  return state;
}
