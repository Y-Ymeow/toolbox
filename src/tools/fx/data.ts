import type { BoardData, ToolCard } from "../types";
import type { FxState } from "../../utils/fx";

export const fxCard: ToolCard = {
  key: "fx",
  name: "汇率计算",
  desc: "多币种换算与区间趋势",
  status: "日更",
  accent: "from-amber-400/30 via-amber-400/10 to-transparent"
};

export function buildFxBoard(fx: FxState): BoardData {
  return {
    title: "汇率计算 · 数据版",
    rows: [
      { label: "基准货币", value: fx.base },
      { label: "最新汇率", value: fx.rate ? `${fx.base} → ${fx.target} ${fx.rate}` : "--" },
      { label: "更新日期", value: fx.date ?? "--" }
    ]
  };
}
