import type { ComponentChildren } from "preact";
import { useMemo, useState } from "preact/hooks";
import type { ToolCard } from "./tools/types";
import { useHashRoute } from "./utils/route";
import { useNow } from "./utils/time";
import { useLocalStorageState } from "./utils/storage";
import { formatDateTime } from "./utils/format";
import { useWeather } from "./utils/weather";
import { useFx } from "./utils/fx";
import { newsFeeds, useNews } from "./utils/news";
import { evaluateExpression, sanitizeExpression } from "./utils/calc";
import { calcCard, buildCalcBoard } from "./tools/calc/data";
import { CalcPage } from "./tools/calc/detail";
import { weatherCard, buildWeatherBoard } from "./tools/weather/data";
import { WeatherPage } from "./tools/weather/detail";
import { fxCard, buildFxBoard } from "./tools/fx/data";
import { FxPage } from "./tools/fx/detail";
import { newsCard, buildNewsBoard } from "./tools/news/data";
import { NewsPage } from "./tools/news/detail";
import { timerCard, buildTimerBoard } from "./tools/timer/data";
import { TimerPage } from "./tools/timer/detail";
import type { TimerItem } from "./tools/timer/types";
import { notesCard, buildNotesBoard } from "./tools/notes/data";
import { NotesPage } from "./tools/notes/detail";
import type { NoteItem } from "./tools/notes/types";
import { rssCard, buildRssBoard } from "./tools/rss/data";
import { RssPage } from "./tools/rss/detail";
import type { RssFeed } from "./tools/rss/types";
import { requestCard, buildRequestBoard } from "./tools/request/data";
import { RequestPage } from "./tools/request/detail";
import type { RequestHistoryItem } from "./tools/request/types";

type HomeBoard = {
  key: ToolCard["key"];
  data: { title: string; rows: { label: string; value: string }[] };
};

function AppShell({
  title,
  now,
  showBack,
  children
}: {
  title: string;
  now: Date;
  showBack: boolean;
  children: ComponentChildren;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#0b1020_55%,_#04070f_100%)] text-slate-100">
      <header className="px-6 pt-10 md:px-12">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_-70px_rgba(56,189,248,0.8)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Toolbox PWA</p>
              <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{title}</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
                统一管理多工具与数据版，随时掌握关键状态与指标。
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">系统状态</span>
              <div className="flex items-center justify-between gap-8">
                <span>同步节点</span>
                <span className="font-semibold text-emerald-300">6/6</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span>当前时间</span>
                <span className="text-base font-semibold text-slate-100 md:text-lg">
                  {formatDateTime(now)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span>实时通道</span>
                <span className="font-semibold text-sky-300">稳定</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span>缓存</span>
                <span className="font-semibold text-amber-300">命中 92%</span>
              </div>
            </div>
          </div>
          {showBack ? (
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <span>当前处于详情页</span>
              <a
                href="#/"
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/20"
              >
                返回首页
              </a>
            </div>
          ) : null}
        </div>
      </header>
      <main className="px-6 pb-16 pt-12 md:px-12">{children}</main>
    </div>
  );
}

function HomePage({ toolCards, boards }: { toolCards: ToolCard[]; boards: HomeBoard[] }) {
  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">工具矩阵</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {toolCards.length.toString().padStart(2, "0")} 模块
          </span>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {toolCards.map((tool) => (
            <a
              key={tool.name}
              href={`#/${tool.key}`}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6 transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${tool.accent}`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">{tool.desc}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                    {tool.status}
                  </span>
                </div>
                <div className="mt-6 text-sm text-slate-300">点击进入详情页 →</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">数据版</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Home Boards</span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {boards.map((board) => (
            <div
              key={board.data.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)]"
            >
              <h3 className="text-lg font-semibold text-white">{board.data.title}</h3>
              <div className="mt-4 space-y-3">
                {board.data.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">{row.label}</span>
                    <span className="text-sm font-semibold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
              <a
                href={`#/${board.key}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/10 py-2 text-sm text-slate-200 transition hover:bg-white/20"
              >
                进入工具
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function App() {
  const route = useHashRoute();
  const now = useNow();
  const [city, setCity] = useLocalStorageState("toolbox.city", "上海");
  const [fxBase, setFxBase] = useLocalStorageState("toolbox.fxBase", "USD");
  const [fxTarget, setFxTarget] = useLocalStorageState("toolbox.fxTarget", "CNY");
  const [fxAmount, setFxAmount] = useLocalStorageState("toolbox.fxAmount", 100);
  const [newsFeed, setNewsFeed] = useLocalStorageState("toolbox.newsFeed", newsFeeds[0]);
  const [expression, setExpression] = useLocalStorageState("toolbox.calcExpression", "sin(pi/4)+2^3");
  const [calcResult, setCalcResult] = useState("--");
  const [calcError, setCalcError] = useState<string | undefined>(undefined);
  const [timers, setTimers] = useLocalStorageState<TimerItem[]>("toolbox.timers", []);
  const [notes, setNotes] = useLocalStorageState<NoteItem[]>("toolbox.notes", []);
  const [rssFeeds, setRssFeeds] = useLocalStorageState<RssFeed[]>("toolbox.rssFeeds", []);
  const [rssSelected, setRssSelected] = useLocalStorageState<string>("toolbox.rssSelected", "");
  const [requestHistory, setRequestHistory] = useLocalStorageState<RequestHistoryItem[]>("toolbox.requestHistory", []);

  // 只在详情页才启用数据加载
  const weather = useWeather(city, route === "weather");
  const fx = useFx(fxBase, fxTarget, fxAmount, route === "fx");
  const resolvedNewsFeed = useMemo(() => {
    const matched = newsFeeds.find((item) => item.url === newsFeed.url);
    return matched ?? newsFeeds[0];
  }, [newsFeed]);
  const news = useNews(resolvedNewsFeed, route === "news");

  const toolCards = [calcCard, weatherCard, fxCard, newsCard, timerCard, notesCard, rssCard, requestCard];
  const boards: HomeBoard[] = [
    { key: "calc", data: buildCalcBoard(expression, calcResult) },
    { key: "weather", data: buildWeatherBoard(weather) },
    { key: "fx", data: buildFxBoard(fx) },
    { key: "news", data: buildNewsBoard(news) },
    { key: "timer", data: buildTimerBoard(timers, now) },
    { key: "notes", data: buildNotesBoard(notes) },
    { key: "rss", data: buildRssBoard(rssFeeds, rssFeeds.find((feed) => feed.id === rssSelected)) },
    { key: "request", data: buildRequestBoard(requestHistory) }
  ];

  const page = useMemo(() => {
    switch (route) {
      case "calc":
        return (
          <CalcPage
            expression={expression}
            result={calcResult}
            error={calcError}
            onExpressionChange={(value) => {
              setExpression(value);
              setCalcError(undefined);
            }}
            onCompute={() => {
              const sanitized = sanitizeExpression(expression);
              if (!sanitized) {
                setCalcError("表达式包含非法字符");
                setCalcResult("--");
                return;
              }
              try {
                const result = evaluateExpression(sanitized);
                setCalcResult(result.toString());
                setCalcError(undefined);
              } catch (error) {
                setCalcError(error instanceof Error ? error.message : "计算失败");
                setCalcResult("--");
              }
            }}
          />
        );
      case "weather":
        return <WeatherPage city={city} weather={weather} onCityChange={setCity} />;
      case "fx":
        return (
          <FxPage
            fx={fx}
            base={fxBase}
            target={fxTarget}
            amount={fxAmount}
            onChange={(next) => {
              if (next.base) setFxBase(next.base.trim() || "USD");
              if (next.target) setFxTarget(next.target.trim() || "CNY");
              if (next.amount !== undefined && !Number.isNaN(next.amount)) setFxAmount(next.amount);
            }}
          />
        );
      case "news":
        return (
          <NewsPage
            news={news}
            feed={resolvedNewsFeed}
            feeds={newsFeeds}
            onChange={(next) => setNewsFeed(next)}
          />
        );
      case "timer":
        return <TimerPage timers={timers} onChange={setTimers} />;
      case "notes":
        return <NotesPage notes={notes} onChange={setNotes} />;
      case "rss":
        return (
          <RssPage
            feeds={rssFeeds}
            selectedId={rssSelected}
            onFeedsChange={setRssFeeds}
            onSelect={(id) => setRssSelected(id ?? "")}
          />
        );
      case "request":
        return (
          <RequestPage
            history={requestHistory}
            onChange={setRequestHistory}
          />
        );
      default:
        return <HomePage toolCards={toolCards} boards={boards} />;
    }
  }, [
    route,
    expression,
    calcResult,
    calcError,
    city,
    weather,
    fx,
    fxBase,
    fxTarget,
    fxAmount,
    news,
    resolvedNewsFeed,
    timers,
    notes,
    rssFeeds,
    rssSelected,
    requestHistory,
    now,
    toolCards,
    boards
  ]);

  return (
    <AppShell title={route === "home" ? "一个集成式工具箱" : "工具详情"} now={now} showBack={route !== "home"}>
      {page}
    </AppShell>
  );
}
