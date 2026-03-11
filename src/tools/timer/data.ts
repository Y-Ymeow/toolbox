import type { BoardData, ToolCard } from "../types";
import type { TimerItem } from "./types";

export const timerCard: ToolCard = {
  key: "timer",
  name: "多场景计时",
  desc: "倒计时 + 秒表并行管理",
  status: "本地",
  accent: "from-fuchsia-400/30 via-fuchsia-400/10 to-transparent"
};

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

export function buildTimerBoard(timers: TimerItem[], now: Date): BoardData {
  const runningCount = timers.filter((item) => item.running).length;
  const countdowns = timers.filter((item) => item.mode === "countdown");
  const soonest = countdowns
    .map((item) => {
      const elapsed =
        item.baseElapsedSec + (item.running && item.startedAt ? (now.getTime() - item.startedAt) / 1000 : 0);
      return Math.max(0, item.durationSec - elapsed);
    })
    .sort((a, b) => a - b)[0];

  return {
    title: "计时器 · 数据版",
    rows: [
      { label: "计时项", value: `${timers.length}` },
      { label: "运行中", value: `${runningCount}` },
      { label: "最近到期", value: soonest === undefined ? "--" : formatClock(soonest) }
    ]
  };
}
