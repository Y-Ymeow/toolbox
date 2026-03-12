type CalcPageProps = {
  expression: string;
  result: string;
  error?: string;
  onExpressionChange: (value: string) => void;
  onCompute: () => void;
};

export function CalcPage({
  expression,
  result,
  error,
  onExpressionChange,
  onCompute,
}: CalcPageProps) {
  const helpers = [
    "sin(pi/4)",
    "cos(pi/3)",
    "tan(pi/6)",
    "sqrt(2)",
    "pow(2,10)",
    "log(1000)",
    "ln(2.71828)",
    "abs(-12.5)",
  ];

  const keypad = [
    ["7", "8", "9", "/", "sin("],
    ["4", "5", "6", "*", "cos("],
    ["1", "2", "3", "-", "tan("],
    ["0", ".", "(", ")", "+"],
    ["pi", "e", "^", "sqrt(", "log("],
    ["ln(", "pow(", "abs(", "C", "⌫"],
    ["="],
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">科学计算器</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <input
            value={expression}
            onInput={(event) =>
              onExpressionChange((event.target as HTMLInputElement).value)
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-slate-100 outline-none focus:border-violet-400"
            placeholder="输入表达式，例如 sin(pi/4)+2^3"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {helpers.map((helper) => (
              <button
                key={helper}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10"
                onClick={() => onExpressionChange(helper)}
              >
                {helper}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="rounded-2xl bg-violet-400/20 px-4 py-2 text-sm font-semibold text-violet-100 hover:bg-violet-400/30"
              onClick={onCompute}
            >
              计算
            </button>
            <span className="text-xs text-slate-400">
              支持 sin / cos / tan / log / ln / sqrt / pow / pi / e
            </span>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                计算结果
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{result}</p>
            </div>
          )}
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            快捷键盘
          </p>
          <div className="mt-4 grid gap-2">
            {keypad.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-2">
                {row.length === 1 ? (
                  <button
                    className="col-span-5 rounded-2xl bg-violet-400/30 px-4 py-3 text-base font-semibold text-violet-50 hover:bg-violet-400/40"
                    onClick={onCompute}
                  >
                    =
                  </button>
                ) : (
                  row.map((key) => (
                    <button
                      key={key}
                      className={`rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-100 hover:bg-white/10 ${
                        key === "C" ? "bg-rose-500/20" : "bg-white/5"
                      }`}
                      onClick={() => {
                        if (key === "C") {
                          onExpressionChange("");
                          return;
                        }
                        if (key === "⌫") {
                          onExpressionChange(expression.slice(0, -1));
                          return;
                        }
                        if (key === "=") {
                          onCompute();
                          return;
                        }
                        onExpressionChange(expression + key);
                      }}
                    >
                      {key}
                    </button>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">提示</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>支持常见科学函数与幂运算符 ^。</li>
          <li>表达式仅在本地计算，不上传数据。</li>
          <li>如果要矩阵或符号计算，可继续加扩展库。</li>
        </ul>
      </div>
    </section>
  );
}
