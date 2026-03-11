import { useEffect, useMemo, useState } from "preact/hooks";
import { useNow } from "../../utils/time";
import type { TimerItem, TimerMode } from "./types";
import { formatDateTime } from "../../utils/format";

export type TimerPageProps = {
  timers: TimerItem[];
  onChange: (next: TimerItem[]) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatClock = (totalSec: number) => {
  const safe = Math.max(0, Math.floor(totalSec));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const computeElapsed = (item: TimerItem, nowMs: number) =>
  item.baseElapsedSec + (item.running && item.startedAt ? (nowMs - item.startedAt) / 1000 : 0);

export function TimerPage({ timers, onChange }: TimerPageProps) {
  const now = useNow(1000);
  const nowMs = now.getTime();
  const [name, setName] = useState("");
  const [mode, setMode] = useState<TimerMode>("countdown");
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const updated = timers.map((item) => {
      if (!item.running || item.mode !== "countdown") return item;
      const elapsed = computeElapsed(item, nowMs);
      if (elapsed < item.durationSec) return item;
      const timestamp = new Date().toISOString();
      return {
        ...item,
        running: false,
        baseElapsedSec: item.durationSec,
        startedAt: undefined,
        updatedAt: timestamp
      };
    });
    const changed = updated.some((item, index) => item !== timers[index]);
    if (changed) onChange(updated);
  }, [nowMs, timers, onChange]);

  const addTimer = () => {
    const trimmed = name.trim() || "未命名计时";
    const mins = Math.max(0, Number.parseInt(minutes || "0", 10));
    const secs = Math.max(0, Number.parseInt(seconds || "0", 10));
    const durationSec = mode === "countdown" ? mins * 60 + secs : 0;
    if (mode === "countdown" && durationSec === 0) return;
    const timestamp = new Date().toISOString();
    const next: TimerItem = {
      id: createId(),
      name: trimmed,
      mode,
      durationSec,
      baseElapsedSec: 0,
      running: false,
      startedAt: undefined,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    onChange([next, ...timers]);
    setName("");
  };

  const updateTimer = (id: string, updater: (item: TimerItem) => TimerItem) => {
    onChange(timers.map((timer) => (timer.id === id ? updater(timer) : timer)));
  };

  const startTimer = (item: TimerItem) => {
    const timestamp = new Date().toISOString();
    const baseElapsedSec =
      item.mode === "countdown" && item.baseElapsedSec >= item.durationSec ? 0 : item.baseElapsedSec;
    updateTimer(item.id, () => ({
      ...item,
      baseElapsedSec,
      running: true,
      startedAt: nowMs,
      updatedAt: timestamp
    }));
  };

  const pauseTimer = (item: TimerItem) => {
    const elapsed = computeElapsed(item, nowMs);
    updateTimer(item.id, () => ({
      ...item,
      baseElapsedSec: elapsed,
      running: false,
      startedAt: undefined,
      updatedAt: new Date().toISOString()
    }));
  };

  const resetTimer = (item: TimerItem) => {
    updateTimer(item.id, () => ({
      ...item,
      baseElapsedSec: 0,
      running: false,
      startedAt: undefined,
      updatedAt: new Date().toISOString()
    }));
  };

  const removeTimer = (id: string) => {
    onChange(timers.filter((timer) => timer.id !== id));
  };

  const summary = useMemo(() => {
    const running = timers.filter((item) => item.running).length;
    return `${timers.length} 项 · ${running} 运行中`;
  }, [timers]);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">计时器</h2>
            <p className="mt-1 text-sm text-slate-300">{summary}</p>
          </div>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {timers.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              还没有计时项，右侧可以新建。
            </div>
          ) : (
            timers.map((item) => {
              const elapsed = computeElapsed(item, nowMs);
              const remaining = item.mode === "countdown" ? item.durationSec - elapsed : elapsed;
              const display = item.mode === "countdown" ? Math.max(0, remaining) : remaining;
              const done = item.mode === "countdown" && remaining <= 0;
              return (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      value={item.name}
                      onInput={(event) => {
                        const value = (event.target as HTMLInputElement).value;
                        updateTimer(item.id, () => ({
                          ...item,
                          name: value,
                          updatedAt: new Date().toISOString()
                        }));
                      }}
                      className="min-w-0 flex-1 bg-transparent text-base font-semibold text-white outline-none"
                    />
                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-slate-200">
                      {item.mode === "countdown" ? "倒计时" : "秒表"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-semibold text-white">{formatClock(display)}</div>
                      <div className="text-xs text-slate-400">
                        {item.mode === "countdown" ? "剩余" : "已用"}
                        {done ? " · 已完成" : ""}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">更新：{formatDateTime(new Date(item.updatedAt))}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.running ? (
                      <button
                        onClick={() => pauseTimer(item)}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/20"
                      >
                        暂停
                      </button>
                    ) : (
                      <button
                        onClick={() => startTimer(item)}
                        className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-400/20"
                      >
                        开始
                      </button>
                    )}
                    <button
                      onClick={() => resetTimer(item)}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/20"
                    >
                      重置
                    </button>
                    <button
                      onClick={() => removeTimer(item.id)}
                      className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/20"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">新建计时</h3>
        <div className="mt-4 space-y-3">
          <input
            value={name}
            onInput={(event) => setName((event.target as HTMLInputElement).value)}
            placeholder="计时名称"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-300"
          />
          <select
            value={mode}
            onChange={(event) => setMode((event.target as HTMLSelectElement).value as TimerMode)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-300"
          >
            <option value="countdown" className="text-slate-900">
              倒计时
            </option>
            <option value="stopwatch" className="text-slate-900">
              秒表
            </option>
          </select>
          {mode === "countdown" ? (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                value={minutes}
                onInput={(event) => setMinutes((event.target as HTMLInputElement).value)}
                placeholder="分钟"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-300"
              />
              <input
                type="number"
                min={0}
                value={seconds}
                onInput={(event) => setSeconds((event.target as HTMLInputElement).value)}
                placeholder="秒"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-fuchsia-300"
              />
            </div>
          ) : null}
          <button
            onClick={addTimer}
            className="w-full rounded-2xl border border-white/10 bg-white/10 py-2 text-sm text-slate-100 transition hover:bg-white/20"
          >
            添加计时
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
          支持并行管理多个倒计时或秒表，数据保存在本地浏览器。
        </div>
      </div>
    </section>
  );
}
