import type { FxState } from "../../utils/fx";
import { formatNumber } from "../../utils/format";

type FxPageProps = {
  fx: FxState;
  base: string;
  target: string;
  amount: number;
  onChange: (next: { base?: string; target?: string; amount?: number }) => void;
};

export function FxPage({ fx, base, target, amount, onChange }: FxPageProps) {
  const converted = fx.rate ? (fx.rate * amount).toFixed(2) : "--";

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">汇率详情</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input
            value={base}
            onInput={(event) =>
              onChange({
                base: (event.target as HTMLInputElement).value.toUpperCase(),
              })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
            placeholder="基准币种 USD"
          />
          <input
            value={target}
            onInput={(event) =>
              onChange({
                target: (event.target as HTMLInputElement).value.toUpperCase(),
              })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
            placeholder="目标币种 CNY"
          />
          <input
            value={amount}
            type="number"
            onInput={(event) =>
              onChange({
                amount: Number((event.target as HTMLInputElement).value),
              })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
            placeholder="金额"
          />
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          {fx.loading ? (
            <p className="text-sm text-slate-300">加载中...</p>
          ) : fx.error ? (
            <p className="text-sm text-rose-300">{fx.error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">最新汇率</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  1 {fx.base} = {formatNumber(fx.rate, 4)} {fx.target}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  更新日期：{fx.date ?? "--"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-400">换算结果</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {amount} {fx.base} ≈ {converted} {fx.target}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">提示</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>汇率数据来自 Frankfurter API（基于欧洲央行）。</li>
          <li>每日更新一次，适合非高频场景。</li>
          <li>可扩展历史曲线或多币种对照。</li>
        </ul>
      </div>
    </section>
  );
}
