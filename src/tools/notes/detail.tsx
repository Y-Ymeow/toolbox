import { useMemo, useState } from "preact/hooks";
import type { NoteItem } from "./types";
import { formatDateTime } from "../../utils/format";

export type NotesPageProps = {
  notes: NoteItem[];
  onChange: (next: NoteItem[]) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function NotesPage({ notes, onChange }: NotesPageProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes],
  );

  const addNote = () => {
    if (!title.trim() && !content.trim()) return;
    const now = new Date().toISOString();
    const next: NoteItem = {
      id: createId(),
      title: title.trim() || "未命名便签",
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    onChange([next, ...notes]);
    setTitle("");
    setContent("");
  };

  const updateNote = (id: string, updater: (note: NoteItem) => NoteItem) => {
    onChange(notes.map((note) => (note.id === id ? updater(note) : note)));
  };

  const removeNote = (id: string) => {
    onChange(notes.filter((note) => note.id !== id));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">便签墙</h2>
          <a href="#/" className="text-sm text-slate-300 hover:text-white">
            返回首页
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sortedNotes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              还没有便签，右侧可以新建。
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <input
                  value={note.title}
                  onInput={(event) => {
                    const value = (event.target as HTMLInputElement).value;
                    updateNote(note.id, (current) => ({
                      ...current,
                      title: value,
                      updatedAt: new Date().toISOString(),
                    }));
                  }}
                  className="w-full bg-transparent text-base font-semibold text-white outline-none"
                />
                <textarea
                  value={note.content}
                  onInput={(event) => {
                    const value = (event.target as HTMLTextAreaElement).value;
                    updateNote(note.id, (current) => ({
                      ...current,
                      content: value,
                      updatedAt: new Date().toISOString(),
                    }));
                  }}
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none focus:border-sky-300"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>更新：{formatDateTime(new Date(note.updatedAt))}</span>
                  <button
                    onClick={() => removeNote(note.id)}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/20"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">新建便签</h3>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onInput={(event) =>
              setTitle((event.target as HTMLInputElement).value)
            }
            placeholder="标题"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
          />
          <textarea
            value={content}
            onInput={(event) =>
              setContent((event.target as HTMLTextAreaElement).value)
            }
            placeholder="记录内容"
            rows={6}
            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
          />
          <button
            onClick={addNote}
            className="w-full rounded-2xl border border-white/10 bg-white/10 py-2 text-sm text-slate-100 transition hover:bg-white/20"
          >
            添加便签
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
          支持多便签并行维护，内容保存在本地浏览器。
        </div>
      </div>
    </section>
  );
}
