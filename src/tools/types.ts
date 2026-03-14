export type ToolKey = "home" | "weather" | "fx" | "news" | "timer" | "calc" | "notes" | "rss" | "request";

export type ToolCard = {
  key: ToolKey;
  name: string;
  desc: string;
  status: string;
  accent: string;
};

export type BoardRow = {
  label: string;
  value: string;
};

export type BoardData = {
  title: string;
  rows: BoardRow[];
};
