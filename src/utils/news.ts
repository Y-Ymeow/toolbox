import { useEffect, useState } from "preact/hooks";

export type NewsItem = {
  title: string;
  link: string;
  pubDate?: string;
  summary?: string;
  image?: string;
};

export type NewsFeed = {
  label: string;
  url: string;
  type: "json" | "rss" | "image";
};

export type NewsState = {
  loading: boolean;
  error?: string;
  feedName: string;
  feedType: NewsFeed["type"];
  items: NewsItem[];
  updatedAt?: string;
};

export const newsFeeds: NewsFeed[] = [
  {
    label: "60s 热点图",
    url: "https://zj.v.api.aa1.cn/api/60s/",
    type: "image",
  },
  {
    label: "喷嚏图卦 (RSS)",
    url: "https://plink.anyfeeder.com/pentitugua",
    type: "rss",
  },
  {
    label: "全网热点 · 百度",
    url: "https://v.api.aa1.cn/api/topbaidu/",
    type: "json",
  },
  {
    label: "热榜 · 综合",
    url: "https://api.vvhan.com/api/hotlist/all",
    type: "json",
  },
  {
    label: "微博热搜",
    url: "https://api.vvhan.com/api/hotlist/wbHot",
    type: "json",
  },
];

type RawHotItem = {
  title?: string;
  name?: string;
  url?: string;
  link?: string;
  mobileUrl?: string;
  mobilUrl?: string;
  hot?: string | number;
  index?: number;
  time?: string;
};

type RawTopBaiduItem = {
  title?: string;
  digest?: string;
  hotnum?: number;
  url?: string;
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
};

const extractFirstImage = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.querySelector("img")?.getAttribute("src") || undefined;
};

export function useNews(feed: NewsFeed, enabled = true) {
  const [state, setState] = useState<NewsState>({
    loading: false,
    feedName: feed.label,
    feedType: feed.type,
    items: [],
  });

  useEffect(() => {
    if (!enabled) {
      setState({
        loading: false,
        feedName: feed.label,
        feedType: feed.type,
        items: [],
      });
      return;
    }

    let active = true;
    let objectUrl: string | undefined;
    const load = async () => {
      setState({
        loading: true,
        feedName: feed.label,
        feedType: feed.type,
        items: [],
      });
      try {
        const resp = await fetch(feed.url);
        if (!resp.ok) throw new Error("新闻源获取失败");
        let parsed: NewsItem[] = [];

        if (feed.type === "image") {
          const image = new Image();
          image.src = feed.url;
          parsed = [
            {
              title: feed.label,
              link: feed.url,
              image: feed.url,
            },
          ];
        } else if (feed.type === "rss") {
          const text = await resp.text();
          console.log(resp, resp.text());
          const xml = new DOMParser().parseFromString(text, "text/xml");
          const items = Array.from(xml.querySelectorAll("item"));
          parsed = items.map((item) => {
            const title =
              item.querySelector("title")?.textContent?.trim() || "(无标题)";
            const link = item.querySelector("link")?.textContent?.trim() || "";
            const pubDate =
              item.querySelector("pubDate")?.textContent?.trim() || undefined;
            const description =
              item.querySelector("description")?.textContent?.trim() || "";
            return {
              title,
              link,
              pubDate,
              summary: description
                ? stripHtml(description).slice(0, 200)
                : undefined,
              image: description ? extractFirstImage(description) : undefined,
            };
          });
        } else {
          const payload = await resp.json();
          const data = payload?.data;
          const list = (
            Array.isArray(data)
              ? data
              : Array.isArray(data?.list)
                ? data.list
                : []
          ) as RawHotItem[];
          const altList = (payload?.newslist ?? []) as RawTopBaiduItem[];
          parsed =
            list.length > 0
              ? list.slice(0, 12).map((item) => ({
                  title: item.title || item.name || "(无标题)",
                  link:
                    item.url ||
                    item.link ||
                    item.mobileUrl ||
                    item.mobilUrl ||
                    "",
                  pubDate: item.time,
                  summary: item.hot ? `热度：${item.hot}` : undefined,
                }))
              : altList.slice(0, 12).map((item) => ({
                  title: item.title || "(无标题)",
                  link: item.url || "",
                  summary:
                    item.digest ||
                    (item.hotnum ? `热度：${item.hotnum}` : undefined),
                }));
        }

        if (!active) return;
        setState({
          loading: false,
          feedName: feed.label,
          feedType: feed.type,
          items: parsed,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          feedName: feed.label,
          feedType: feed.type,
          items: [],
          error: error instanceof Error ? error.message : "未知错误",
        });
      }
    };

    load();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [feed, enabled]);

  return state;
}
