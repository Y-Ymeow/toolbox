import type { BoardData, ToolCard } from "../types";
import type { NoteItem } from "./types";

export const notesCard: ToolCard = {
  key: "notes",
  name: "便签墙",
  desc: "多便签快速记录与整理",
  status: "本地",
  accent: "from-sky-400/30 via-sky-400/10 to-transparent"
};

export function buildNotesBoard(notes: NoteItem[]): BoardData {
  const sorted = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return {
    title: "便签 · 数据版",
    rows: [
      { label: "便签数量", value: `${notes.length}` },
      { label: "最近更新", value: sorted[0]?.title || "--" },
      { label: "最新内容", value: sorted[0]?.content ? `${sorted[0].content.slice(0, 16)}…` : "--" }
    ]
  };
}
