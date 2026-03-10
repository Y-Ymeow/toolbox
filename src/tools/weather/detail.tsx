import type { WeatherState } from "../../utils/weather";
import { formatNumber } from "../../utils/format";
import { weatherCodeText } from "../../utils/weather";

type WeatherPageProps = {
  city: string;
  weather: WeatherState;
  onCityChange: (value: string) => void;
};

export function WeatherPage({ city, weather, onCityChange }: WeatherPageProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">天气详情</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={city}
            onInput={(event) => onCityChange((event.target as HTMLInputElement).value)}
            placeholder="输入城市，例如 上海"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 md:w-64"
          />
          <span className="text-xs text-slate-400">回车或切换城市自动刷新</span>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          {weather.loading ? (
            <p className="text-sm text-slate-300">加载中...</p>
          ) : weather.error ? (
            <p className="text-sm text-rose-300">{weather.error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">当前位置</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {weather.city} {weather.country ? `· ${weather.country}` : ""}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {weatherCodeText[weather.weatherCode ?? -1] ?? "--"} · 体感 {formatNumber(
                    weather.apparent
                  )}
                  °C
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">当前温度</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {formatNumber(weather.temperature)}°C
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">风速</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {formatNumber(weather.wind)} m/s
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">今日最高</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {formatNumber(weather.high)}°C
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">今日最低</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {formatNumber(weather.low)}°C
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">提示</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>天气数据来自 Open-Meteo，支持全球城市检索。</li>
          <li>默认显示当前温度、体感温度、风速与当天高低温。</li>
          <li>可扩展更多指标（降水、空气质量、雷达等）。</li>
        </ul>
      </div>
    </section>
  );
}
