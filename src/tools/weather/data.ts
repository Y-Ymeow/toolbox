import type { BoardData, ToolCard } from "../types";
import type { WeatherState } from "../../utils/weather";
import { formatNumber } from "../../utils/format";

export const weatherCard: ToolCard = {
  key: "weather",
  name: "天气系统",
  desc: "多城市实时天气与预报",
  status: "实时",
  accent: "from-sky-400/30 via-sky-400/10 to-transparent"
};

export function buildWeatherBoard(weather: WeatherState): BoardData {
  return {
    title: "天气系统 · 数据版",
    rows: [
      { label: "城市", value: weather.city ?? "--" },
      { label: "当前温度", value: `${formatNumber(weather.temperature)}°C` },
      { label: "今日温差", value: `${formatNumber(weather.low)}°C / ${formatNumber(weather.high)}°C` }
    ]
  };
}
