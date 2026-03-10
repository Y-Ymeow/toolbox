import type { BoardData, ToolCard } from "../types";

export const timerCard: ToolCard = {
  key: "timer",
  name: "项目计时",
  desc: "专注节奏与待办提示",
  status: "本地",
  accent: "from-fuchsia-400/30 via-fuchsia-400/10 to-transparent"
};

export const timerBoard: BoardData = {
  title: "项目计时 · 数据版",
  rows: [
    { label: "当前专注", value: "25:00" },
    { label: "下一休息", value: "5:00" },
    { label: "本周目标", value: "10h" }
  ]
};
