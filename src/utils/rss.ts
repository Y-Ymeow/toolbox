import { useEffect, useState } from "preact/hooks";

export type RssItem = {
  title: string;
  link: string;
  pubDate?: string;
  summary?: string;
  content?: string;
  image?: string;
  images?: string[];
};

export type RssState = {
  loading: boolean;
  error?: string;
  feedTitle?: string;
  items: RssItem[];
  updatedAt?: string;
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
};

const extractFirstImage = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const img = doc.querySelector("img");
  if (!img) return undefined;
  return (
    img.getAttribute("src") ||
    img.getAttribute("data-src") ||
    img.getAttribute("data-original") ||
    img.getAttribute("data-lazy-src") ||
    img.getAttribute("data-actualsrc") ||
    undefined
  );
};

const extractImages = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const nodes = Array.from(doc.querySelectorAll("img"));
  const images = nodes
    .map(
      (img) =>
        img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        img.getAttribute("data-lazy-src") ||
        img.getAttribute("data-actualsrc") ||
        ""
    )
    .map((value) => value.trim())
    .filter(Boolean);
  return images.length > 0 ? images : undefined;
};

const extractLink = (node: Element | null) => {
  if (!node) return "";
  return node.getAttribute("href") || node.textContent?.trim() || "";
};

export function useRss(url?: string, reloadKey = 0) {
  const [state, setState] = useState<RssState>({
    loading: false,
    items: [],
  });

  useEffect(() => {
    if (!url) {
      setState({ loading: false, items: [] });
      return;
    }

    let active = true;
    const load = async () => {
      setState({ loading: true, items: [] });
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("RSS 获取失败");
        const text = await resp.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const channelTitle =
          xml.querySelector("channel > title")?.textContent?.trim() ||
          xml.querySelector("feed > title")?.textContent?.trim() ||
          undefined;

        const rssItems = Array.from(xml.querySelectorAll("item"));
        const atomItems = Array.from(xml.querySelectorAll("entry"));
        const items = (rssItems.length > 0 ? rssItems : atomItems).map(
          (item) => {
            const title =
              item.querySelector("title")?.textContent?.trim() || "(无标题)";
            const link = extractLink(item.querySelector("link"));
            const pubDate =
              item.querySelector("pubDate")?.textContent?.trim() ||
              item.querySelector("updated")?.textContent?.trim() ||
              item.querySelector("published")?.textContent?.trim() ||
              undefined;
          const description =
            item.querySelector("description")?.textContent?.trim() ||
            item.querySelector("summary")?.textContent?.trim() ||
            item.querySelector("content")?.textContent?.trim() ||
            "";
          const images = description ? extractImages(description) : undefined;
          const image =
            item.querySelector("enclosure")?.getAttribute("url") ||
            item.querySelector("media\\:content")?.getAttribute("url") ||
            images?.[0] ||
            (description ? extractFirstImage(description) : undefined);
          return {
            title,
            link,
            pubDate,
            summary: description
              ? stripHtml(description).slice(0, 180)
              : undefined,
            content: description ? stripHtml(description) : undefined,
            image,
            images,
          };
        }
        );

        if (!active) return;
        setState({
          loading: false,
          feedTitle: channelTitle,
          items,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          items: [],
          error: error instanceof Error ? error.message : "未知错误",
        });
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [url, reloadKey]);

  return state;
}
