import type { NewsFeed, NewsState } from "../../utils/news";

type NewsPageProps = {
  news: NewsState;
  feed: NewsFeed;
  feeds: NewsFeed[];
  onChange: (next: NewsFeed) => void;
};

export function NewsPage({ news, feed, feeds, onChange }: NewsPageProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">新闻源详情</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={feed.url}
            onChange={(event) => {
              const url = (event.target as HTMLSelectElement).value;
              const selected =
                feeds.find((item) => item.url === url) || feeds[0];
              onChange(selected);
            }}
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
          >
            {feeds.map((feed) => (
              <option
                key={feed.url}
                value={feed.url}
                className="text-slate-900"
              >
                {feed.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400">
            {feed.type === "rss"
              ? "RSS 解析"
              : feed.type === "image"
                ? "直连图片"
                : "直连 JSON"}
          </span>
          <span className="text-xs text-slate-500">数据来源：公开平台</span>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-2">
          {news.loading ? (
            <p className="text-sm text-slate-300">加载中...</p>
          ) : news.error ? (
            <p className="text-sm text-rose-300">{news.error}</p>
          ) : (
            <div className="space-y-4">
              {news.items.map((item) => (
                <article
                  key={`${item.link || item.title}`}
                  className="rounded-2xl border border-white/10 bg-white/5"
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-semibold text-white hover:text-emerald-200"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-base font-semibold text-white">
                      {item.title}
                    </span>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {item.pubDate ?? ""}
                  </p>
                  {item.summary ? (
                    <p className="mt-2 text-sm text-slate-300">
                      {item.summary}
                    </p>
                  ) : null}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="mt-3 w-full rounded-2xl border border-white/10 object-cover"
                    />
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-2">
        <h3 className="text-lg font-semibold text-white">提示</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>已支持图片源、RSS 和 JSON 热榜三类格式。</li>
          <li>默认直连公开接口，若某源不支持跨域可手动替换。</li>
          <li>如需更稳定或更细分的新闻源，可补充自建 API。</li>
        </ul>
      </div>
    </section>
  );
}
