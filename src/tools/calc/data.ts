import type { BoardData, ToolCard } from "../types";

export const calcCard: ToolCard = {
  key: "calc",
  name: "科学计算",
  desc: "函数、幂、矩阵表达式",
  status: "本地",
  accent: "from-violet-400/30 via-violet-400/10 to-transparent"
};

export function buildCalcBoard(expression: string, result: string): BoardData {
  return {
    title: "科学计算 · 数据版",
    rows: [
      { label: "最近公式", value: expression || "--" },
      { label: "结果", value: result || "--" },
      { label: "模式", value: "高精度" }
    ]
  };
}
