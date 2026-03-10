export function TimerPage() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">项目计时</h2>
        <a href="#/" className="text-sm text-slate-300 hover:text-white">
          返回首页
        </a>
      </div>
      <p className="mt-4 text-sm text-slate-300">
        这里可以接入本地番茄钟、专注统计或团队节奏管理工具。当前示例为占位视图，
        你可以告诉我具体需求后继续扩展。
      </p>
    </section>
  );
}
