import { useEffect, useMemo, useState } from "preact/hooks";
import type { RssFeed } from "./types";
import { useRss } from "../../utils/rss";
import { formatDateTime } from "../../utils/format";

export type RssPageProps = {
  feeds: RssFeed[];
  selectedId?: string;
  onFeedsChange: (next: RssFeed[]) => void;
  onSelect: (id?: string) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function RssPage({
  feeds,
  selectedId,
  onFeedsChange,
  onSelect,
}: RssPageProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(8);
  const [openLink, setOpenLink] = useState<string | null>(null);

  const selected = useMemo(
    () => feeds.find((item) => item.id === selectedId) || feeds[0],
    [feeds, selectedId],
  );
  const rss = useRss(selected?.url, reloadKey);
  const itemKeys = useMemo(
    () => rss.items.map((item, index) => item.link || `${item.title}-${index}`),
    [rss.items],
  );
  const pagedItems = useMemo(
    () => rss.items.slice(0, pageSize),
    [rss.items, pageSize],
  );
  const selectedItem = useMemo(() => {
    if (!selectedItemKey) return null;
    const index = itemKeys.indexOf(selectedItemKey);
    return index >= 0 ? rss.items[index] : null;
  }, [itemKeys, rss.items, selectedItemKey]);

  useEffect(() => {
    if (!selected && feeds.length > 0) onSelect(feeds[0].id);
  }, [selected?.id, feeds.length]);

  useEffect(() => {
    if (!selectedItemKey) return;
    if (!itemKeys.includes(selectedItemKey)) setSelectedItemKey(null);
  }, [itemKeys, selectedItemKey]);
  useEffect(() => {
    setSelectedItemKey(null);
    setPageSize(8);
  }, [selected?.id]);

  const addFeed = () => {
    if (!name.trim() || !url.trim()) return;
    const timestamp = new Date().toISOString();
    const next: RssFeed = {
      id: createId(),
      name: name.trim(),
      url: url.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    onFeedsChange([next, ...feeds]);
    onSelect(next.id);
    setName("");
    setUrl("");
  };

  const removeFeed = (id: string) => {
    const next = feeds.filter((item) => item.id !== id);
    onFeedsChange(next);
    if (selectedId === id) onSelect(next[0]?.id);
  };

  const summary = `${feeds.length} 个订阅源`;

  return (
    <>
      <section className="grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">RSS 订阅</h2>
              <p className="mt-1 text-sm text-slate-300">{summary}</p>
            </div>
            <a href="#/" className="text-sm text-slate-300 hover:text-white">
              返回首页
            </a>
          </div>
          <div className="mt-4 space-y-3">
            <input
              value={name}
              onInput={(event) =>
                setName((event.target as HTMLInputElement).value)
              }
              placeholder="订阅名称"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-300"
            />
            <input
              value={url}
              onInput={(event) =>
                setUrl((event.target as HTMLInputElement).value)
              }
              placeholder="订阅地址 (https://...)"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-300"
            />
            <button
              onClick={addFeed}
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-2 text-sm text-slate-100 transition hover:bg-white/20"
            >
              添加订阅
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {feeds.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                还没有订阅源，先添加一个吧。
              </div>
            ) : (
              feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        {feed.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-400 break-all">
                        {feed.url}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelect(feed.id)}
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs transition ${
                        selected?.id === feed.id
                          ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                          : "border-white/10 bg-white/10 text-slate-200 hover:bg-white/20"
                      }`}
                    >
                      查看
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      更新：{formatDateTime(new Date(feed.updatedAt))}
                    </span>
                    <button
                      onClick={() => removeFeed(feed.id)}
                      className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/20"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {selected?.name || "订阅详情"}
              </h3>
              <p className="mt-1 break-all text-xs text-slate-400">
                {selected?.url || "未选择订阅"}
              </p>
            </div>
            <button
              onClick={() => setReloadKey((prev) => prev + 1)}
              className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/20"
            >
              刷新
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            {rss.loading
              ? "加载中..."
              : rss.error
                ? `加载失败：${rss.error}`
                : rss.feedTitle
                  ? `频道：${rss.feedTitle}`
                  : "RSS 已准备"}
          </div>
          <div className="mt-4 space-y-3">
            {rss.loading ? null : rss.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                暂无内容或该源不支持浏览器直连。
              </div>
            ) : selectedItem ? (
              <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedItemKey(null)}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/20"
                  >
                    返回列表
                  </button>
                  {selectedItem.link ? (
                    <button
                      onClick={() => setOpenLink(selectedItem.link)}
                      className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-400/20"
                    >
                      打开原文
                    </button>
                  ) : null}
                </div>
                <h4 className="mt-4 text-xl font-semibold text-white">
                  {selectedItem.title}
                </h4>
                <p className="mt-2 text-xs text-slate-400">
                  {selectedItem.pubDate || ""}
                </p>
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt=""
                    loading="lazy"
                    className="mt-4 w-full rounded-2xl border border-white/10 object-cover"
                  />
                ) : null}
                {selectedItem.content ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-200">
                    {selectedItem.content}
                  </p>
                ) : selectedItem.summary ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-200">
                    {selectedItem.summary}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-slate-300">暂无摘要内容。</p>
                )}
              </article>
            ) : (
              <>
                {pagedItems.map((item, index) => {
                  const key = itemKeys[index];
                  return (
                    <article
                      key={key}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-xs text-slate-400">
                          {item.pubDate || ""}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedItemKey(key)}
                        className="shrink-0 whitespace-nowrap rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-400/20"
                      >
                        查看详情
                      </button>
                    </div>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="mt-3 w-full rounded-2xl border border-white/10 object-cover"
                        />
                      ) : null}
                      {item.summary ? (
                        <p className="mt-2 text-sm text-slate-300">
                          {item.summary}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
                {rss.items.length > pageSize ? (
                  <button
                    onClick={() => setPageSize((size) => size + 8)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
                  >
                    加载更多
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
      {openLink ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-0 sm:p-4"
          onClick={() => setOpenLink(null)}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-none border border-white/10 bg-slate-950 sm:h-[80vh] sm:max-w-5xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-slate-200">
              <span className="truncate">{openLink}</span>
              <button
                onClick={() => setOpenLink(null)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/20"
              >
                关闭
              </button>
            </div>
            <iframe title="RSS 原文" src={openLink} className="h-full w-full" />
          </div>
        </div>
      ) : null}
    </>
  );
}
