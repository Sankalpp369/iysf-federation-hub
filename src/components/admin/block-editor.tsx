import { useEffect, useRef, useState } from "react";
import { GripVertical, Trash2, Plus, Undo2, Redo2, ArrowUp, ArrowDown } from "lucide-react";
import { type Block, type BlockType, BLOCK_MENU, emptyBlock, toEmbedUrl } from "@/lib/blocks";
import { MediaLibrary } from "./media-library";
import { IYSF } from "../site-chrome";

const field = "w-full rounded-md border bg-white px-3 py-2 text-sm";
const bc = { borderColor: IYSF.blueLine };

export function useHistory(initial: Block[]) {
  const [state, setState] = useState({ past: [] as Block[][], now: initial, future: [] as Block[][] });
  const last = useRef(0);
  return {
    blocks: state.now,
    set: (next: Block[]) =>
      setState((s) => {
        const t = Date.now();
        const merge = t - last.current < 800;
        last.current = t;
        return { past: merge ? s.past : [...s.past.slice(-99), s.now], now: next, future: [] };
      }),
    reset: (b: Block[]) => setState({ past: [], now: b, future: [] }),
    undo: () => setState((s) => (s.past.length ? { past: s.past.slice(0, -1), now: s.past[s.past.length - 1], future: [s.now, ...s.future] } : s)),
    redo: () => setState((s) => (s.future.length ? { past: [...s.past, s.now], now: s.future[0], future: s.future.slice(1) } : s)),
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}

export function BlockEditor({ h }: { h: ReturnType<typeof useHistory> }) {
  const { blocks, set } = h;
  const [drag, setDrag] = useState<number | null>(null);
  const [menuAt, setMenuAt] = useState<number | null>(null);
  const [picker, setPicker] = useState<number | null>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) h.redo(); else h.undo();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [h]);

  const update = (i: number, b: Block) => set(blocks.map((x, k) => (k === i ? b : x)));
  const insert = (at: number, type: BlockType, replace = false) => {
    const nb = emptyBlock(type);
    const arr = [...blocks];
    arr.splice(at, replace ? 1 : 0, nb);
    set(arr);
    setMenuAt(null);
    if (type === "image") setPicker(at);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const arr = [...blocks];
    const [b] = arr.splice(from, 1);
    arr.splice(to, 0, b);
    set(arr);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={h.undo} disabled={!h.canUndo} aria-label="Undo" className="rounded-md border p-2 disabled:opacity-40" style={bc}><Undo2 size={16} /></button>
        <button type="button" onClick={h.redo} disabled={!h.canRedo} aria-label="Redo" className="rounded-md border p-2 disabled:opacity-40" style={bc}><Redo2 size={16} /></button>
        <span className="text-xs opacity-60">Type “/” in an empty paragraph to add a block.</span>
      </div>
      <ol className="space-y-2">
        {blocks.map((b, i) => (
          <li
            key={b.id}
            draggable={drag === i}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); }}
            className="group relative flex gap-1.5 rounded-lg border bg-white p-2"
            style={bc}
          >
            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <span onMouseDown={() => setDrag(i)} onMouseUp={() => setDrag(null)} className="cursor-grab p-1 opacity-50" aria-hidden="true"><GripVertical size={16} /></span>
              <button type="button" onClick={() => move(i, i - 1)} aria-label="Move up" className="p-1 opacity-60"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, i + 1)} aria-label="Move down" className="p-1 opacity-60"><ArrowDown size={14} /></button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: IYSF.blue }}>{BLOCK_MENU.find((m) => m.type === b.type)?.label}</div>
              <BlockFields b={b} onChange={(nb) => update(i, nb)} onSlash={() => setMenuAt(i)} onPick={() => setPicker(i)} />
              {menuAt === i && <SlashMenu onPick={(t) => insert(i, t, b.type === "paragraph" && !b.text.replace("/", "").trim())} onClose={() => setMenuAt(null)} />}
            </div>
            <button type="button" onClick={() => set(blocks.filter((_, k) => k !== i))} aria-label="Delete block" className="self-start p-1.5" style={{ color: IYSF.magenta }}><Trash2 size={16} /></button>
          </li>
        ))}
      </ol>
      <div className="relative mt-3">
        <button type="button" onClick={() => setMenuAt(menuAt === -1 ? null : -1)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border px-3 text-sm font-semibold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>
          <Plus size={16} /> Add block
        </button>
        {menuAt === -1 && <SlashMenu onPick={(t) => insert(blocks.length, t)} onClose={() => setMenuAt(null)} />}
      </div>
      {picker !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label="Choose image">
          <div className="max-h-[85dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white p-4 sm:rounded-xl">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Choose an image</h2><button type="button" onClick={() => setPicker(null)} className="text-sm font-semibold">Close</button></div>
            <MediaLibrary onPick={(m) => {
              const cur = blocks[picker];
              if (cur?.type === "image") update(picker, { ...cur, url: m.url, alt: cur.alt || m.alt || "" });
              setPicker(null);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function SlashMenu({ onPick, onClose }: { onPick: (t: BlockType) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const items = BLOCK_MENU.filter((m) => m.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="absolute left-0 z-20 mt-1 w-64 rounded-lg border bg-white p-1 shadow-lg" style={bc}>
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search blocks…" className={`${field} mb-1`} style={bc}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "Enter" && items[0]) { e.preventDefault(); onPick(items[0].type); } }} />
      <ul role="listbox">
        {items.map((m) => (
          <li key={m.type}>
            <button type="button" onClick={() => onPick(m.type)} className="flex w-full items-baseline justify-between rounded px-2 py-2 text-left text-sm hover:bg-black/5">
              <span className="font-semibold">{m.label}</span><span className="text-xs opacity-60">{m.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockFields({ b, onChange, onSlash, onPick }: { b: Block; onChange: (b: Block) => void; onSlash: () => void; onPick: () => void }) {
  switch (b.type) {
    case "paragraph":
      return <textarea rows={3} value={b.text} className={field} style={bc} placeholder="Write something, or type / for blocks"
        onChange={(e) => { onChange({ ...b, text: e.target.value }); if (e.target.value === "/") onSlash(); }} />;
    case "heading":
      return (
        <div className="flex gap-2">
          <select value={b.level} onChange={(e) => onChange({ ...b, level: Number(e.target.value) as 2 | 3 })} className="rounded-md border px-2 text-sm" style={bc} aria-label="Heading level">
            <option value={2}>H2</option><option value={3}>H3</option>
          </select>
          <input value={b.text} onChange={(e) => onChange({ ...b, text: e.target.value })} className={`${field} font-bold`} style={bc} placeholder="Heading" />
        </div>
      );
    case "list":
      return (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={b.ordered} onChange={(e) => onChange({ ...b, ordered: e.target.checked })} /> Numbered</label>
          <textarea rows={4} value={b.items.join("\n")} onChange={(e) => onChange({ ...b, items: e.target.value.split("\n") })} className={field} style={bc} placeholder="One item per line" />
        </div>
      );
    case "image":
      return (
        <div className="space-y-2">
          {b.url ? <img src={b.url} alt="" className="max-h-48 rounded-md" /> : null}
          <button type="button" onClick={onPick} className="min-h-10 rounded-md border px-3 text-sm font-semibold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>{b.url ? "Change image" : "Choose image"}</button>
          <input value={b.alt} onChange={(e) => onChange({ ...b, alt: e.target.value })} className={field} style={bc} placeholder="Alt text (describe the image)" />
          <input value={b.caption ?? ""} onChange={(e) => onChange({ ...b, caption: e.target.value })} className={field} style={bc} placeholder="Caption (optional)" />
        </div>
      );
    case "quote":
      return (
        <div className="space-y-2">
          <textarea rows={2} value={b.text} onChange={(e) => onChange({ ...b, text: e.target.value })} className={`${field} italic`} style={bc} placeholder="Quote" />
          <input value={b.attribution ?? ""} onChange={(e) => onChange({ ...b, attribution: e.target.value })} className={field} style={bc} placeholder="Attribution" />
        </div>
      );
    case "video":
      return (
        <div>
          <input value={b.url} onChange={(e) => onChange({ ...b, url: e.target.value })} className={field} style={bc} placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…" />
          {b.url && !toEmbedUrl(b.url) && <p className="mt-1 text-xs" style={{ color: IYSF.magenta }}>Only YouTube and Vimeo links are allowed.</p>}
        </div>
      );
    case "button":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={b.label} onChange={(e) => onChange({ ...b, label: e.target.value })} className={field} style={bc} placeholder="Button label" />
          <input value={b.href} onChange={(e) => onChange({ ...b, href: e.target.value })} className={field} style={bc} placeholder="/events or https://…" />
        </div>
      );
    case "divider":
      return <hr style={bc} />;
    case "callout":
      return <textarea rows={2} value={b.text} onChange={(e) => onChange({ ...b, text: e.target.value })} className={field} style={{ ...bc, background: "rgba(250,175,64,0.1)" }} placeholder="Callout text" />;
  }
}
