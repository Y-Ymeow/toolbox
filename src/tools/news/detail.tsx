import type { NewsState } from "../../utils/news";

export type NewsFeed = {
  label: string;
  url: string;
};

type NewsPageProps = {
  news: NewsState;
  feedUrl: string;
  feeds: NewsFeed[];
  onChange: (next: { feedUrl: string; feedName: string }) => void;
};

export function NewsPage({ news, feedUrl, feeds, onChange }: NewsPageProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">新闻源详情</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={feedUrl}
            onChange={(event) => {
              const url = (event.target as HTMLSelectElement).value;
              const selected = feeds.find((item) => item.url === url) || feeds[0];
              onChange({ feedUrl: selected.url, feedName: selected.label });
            }}
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
          >
            {feeds.map((feed) => (
              <option key={feed.url} value={feed.url} className="text-slate-900">
                {feed.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400">使用公共 RSS 源 + CORS 代理</span>
          <span className="text-xs text-slate-500">数据来源：中央社 RSS</span>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          {news.loading ? (
            <p className="text-sm text-slate-300">加载中...</p>
          ) : news.error ? (
            <p className="text-sm text-rose-300">{news.error}</p>
          ) : (
            <div className="space-y-4">
              {news.items.map((item) => (
                <article key={item.link} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-semibold text-white hover:text-emerald-200"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-xs text-slate-400">{item.pubDate ?? ""}</p>
                  {item.summary ? <p className="mt-2 text-sm text-slate-300">{item.summary}</p> : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">提示</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>默认接入中央社 RSS（请保留署名并遵守非商业使用条款），可替换为其他新闻源。</li>
          <li>RSS 通过 AllOrigins 代理解决浏览器 CORS 限制。</li>
          <li>如需更稳定的新闻源，可加后端代理或付费新闻 API。</li>
        </ul>
      </div>
    </section>
  );
}
