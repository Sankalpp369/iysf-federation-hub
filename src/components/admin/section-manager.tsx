import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deleteApplication, deleteCmsSection, reorderOfficials, saveCmsSection, updateApplication } from "@/lib/cms.functions";
import { IYSF } from "../site-chrome";
import { MediaLibrary } from "./media-library";

type Section = "events" | "rules" | "results" | "officials" | "homepage" | "applications";
type Field = { key: string; label: string; type?: "textarea" | "date" | "datetime-local" | "url" | "checkbox" | "number" };
const CONFIG: Record<Exclude<Section, "applications">, { table: string; title: string; fields: Field[]; search: string }> = {
  events: { table: "cms_events", title: "Events", search: "title", fields: [
    { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "starts_at", label: "Start date and time", type: "datetime-local" }, { key: "ends_at", label: "End date and time", type: "datetime-local" }, { key: "location", label: "Location" }, { key: "description", label: "Description (block JSON)", type: "textarea" }, { key: "cover_image_url", label: "Cover image URL", type: "url" }, { key: "cover_alt", label: "Cover image alt text" }, { key: "registration_url", label: "Registration link", type: "url" }, { key: "status", label: "Status" },
  ] },
  rules: { table: "cms_rules", title: "Rules & rule documents", search: "title", fields: [
    { key: "kind", label: "Element type (document or download)" }, { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "content", label: "Rule content (documents)", type: "textarea" }, { key: "accent", label: "Accent color (hex)" }, { key: "availability", label: "Availability label (downloads)" }, { key: "tone", label: "Label tone (success, warning, neutral)" }, { key: "description", label: "Description", type: "textarea" }, { key: "download_url", label: "PDF download URL", type: "url" }, { key: "display_order", label: "Display order", type: "number" }, { key: "visible", label: "Visible", type: "checkbox" },
  ] },
  results: { table: "cms_results", title: "Results", search: "competition_name", fields: [
    { key: "competition_name", label: "Competition name" }, { key: "slug", label: "Slug" }, { key: "competition_date", label: "Date", type: "date" }, { key: "location", label: "Location" }, { key: "category", label: "Category / age group" }, { key: "rows", label: "Results rows (JSON or spreadsheet-pasted rows)", type: "textarea" }, { key: "official_sheet_url", label: "Official score sheet URL", type: "url" }, { key: "status", label: "Status" },
  ] },
  officials: { table: "cms_officials", title: "Officials", search: "name", fields: [
    { key: "name", label: "Name" }, { key: "role_title", label: "Role / title" }, { key: "country", label: "Country" }, { key: "photo_url", label: "Photo URL", type: "url" }, { key: "bio", label: "Short bio", type: "textarea" }, { key: "display_order", label: "Display order", type: "number" }, { key: "visible", label: "Visible", type: "checkbox" },
  ] },
  homepage: { table: "cms_homepage", title: "Homepage", search: "headline", fields: [
    { key: "hero_image_url", label: "Hero image URL", type: "url" }, { key: "hero_alt", label: "Hero image alt text" }, { key: "headline", label: "Headline" }, { key: "button_text", label: "Hero button text" }, { key: "button_url", label: "Hero button link", type: "url" }, { key: "intro_text", label: "Intro text", type: "textarea" }, { key: "sections", label: "Sections, in display order (JSON array)", type: "textarea" },
  ] },
};

const TABLES = supabase as any;
const datetimeLocal = (s?: string | null) => s ? new Date(s).toISOString().slice(0, 16) : "";

export function SectionManager({ section }: { section: Section }) {
  const cfg = section === "applications" ? null : CONFIG[section];
  const qc = useQueryClient();
  const saveSection = useServerFn(saveCmsSection);
  const deleteSection = useServerFn(deleteCmsSection);
  const saveApplicationFn = useServerFn(updateApplication);
  const deleteApplicationFn = useServerFn(deleteApplication);
  const reorderOfficialsFn = useServerFn(reorderOfficials);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [mediaField, setMediaField] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const isApplications = section === "applications";
  const table = isApplications ? "federation_applications" : cfg!.table;
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["cms-section", section],
    queryFn: async () => {
      let q = TABLES.from(table).select("*");
      if (isApplications) q = q.order("created_at", { ascending: false });
      else if (section === "events") q = q.order("starts_at", { ascending: true });
      else if (section === "rules") q = q.order("display_order", { ascending: true });
      else if (section === "results") q = q.order("competition_date", { ascending: false });
      else if (section === "officials") q = q.order("display_order", { ascending: true });
      const { data: rows, error: e } = await q;
      if (e) throw e;
      return rows ?? [];
    },
  });
  const visibleRows = useMemo(() => data.filter((r: any) => {
    const text = isApplications ? JSON.stringify(r).toLowerCase() : String(r[cfg!.search] ?? "").toLowerCase();
    return text.includes(query.toLowerCase()) && (isApplications ? filter === "all" || r.status === filter : section !== "events" && section !== "results" || filter === "all" || r.status === filter);
  }), [data, query, filter, isApplications, cfg, section]);

  async function save(silent = false) {
    if (!editing || saving) return;
    if (!isApplications && section === "events" && (!editing.title?.trim() || !editing.slug?.trim() || !editing.starts_at || Number.isNaN(new Date(editing.starts_at).getTime()))) { if (!silent) toast.error("Enter a title, slug, and valid start date."); return; }
    if (!isApplications && section === "results" && (!editing.competition_name?.trim() || !editing.slug?.trim() || !editing.competition_date)) { if (!silent) toast.error("Enter a competition name, slug, and date."); return; }
    const fields = cfg?.fields ?? [];
    const values: Record<string, any> = {};
    for (const field of fields) {
      let v = editing[field.key];
      if (field.type === "datetime-local") v = v ? new Date(v).toISOString() : null;
      if (field.type === "number") v = Number(v ?? 0);
      if (["sections", "rows", "description"].includes(field.key) && typeof v === "string") {
        try { v = JSON.parse(v); } catch {
          if (field.key !== "rows") { if (!silent) toast.error(`${field.label} must be valid JSON`); return; }
          const lines = v.split(/\r?\n/).filter((line: string) => line.trim());
          const headers = (lines.shift() ?? "").split("\t").map((x: string) => x.trim().toLowerCase());
          const key = (aliases: string[]) => headers.findIndex((h: string) => aliases.includes(h));
          const ri = key(["rank", "place"]), ai = key(["athlete", "athlete name", "name"]), ci = key(["country"]), si = key(["score", "points"]);
          if (ri < 0 || ai < 0) { if (!silent) toast.error("Paste a tab separated table with Rank, Athlete, Country and Score columns, or valid JSON."); return; }
          v = lines.map((line: string) => { const cells = line.split("\t"); return { rank: cells[ri] ?? "", athlete_name: cells[ai] ?? "", country: ci < 0 ? "" : cells[ci] ?? "", score: si < 0 ? "" : cells[si] ?? "" }; });
        }
      }
      values[field.key] = v;
    }
    setSaving(true);
    try {
      const result = await saveSection({ data: {
        section: section as "events" | "rules" | "results" | "officials" | "homepage",
        ...(section !== "homepage" && typeof editing.id === "string" ? { id: editing.id } : {}),
        values,
      } as any });
      setSaving(false);
      setSavedAt(new Date());
      if (silent) setEditing({ ...editing, id: editing.id ?? result.id });
      else { toast.success("Saved"); setEditing(null); }
      void qc.invalidateQueries({ queryKey: ["cms-section", section] });
    } catch (e) {
      setSaving(false);
      if (!silent) toast.error(e instanceof Error ? e.message : "Couldn't save this item");
    }
  }
  useEffect(() => {
    if (!editing || editing.id === true || editing.status === "published") return;
    const t = setTimeout(() => void save(true), 30000);
    return () => clearTimeout(t);
  }, [editing]);
  useEffect(() => {
    if (!editing) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing]);
  async function remove(row: any) {
    const name = isApplications ? `application from ${row.email ?? "this applicant"}` : row.title ?? row.competition_name ?? row.name ?? "this item";
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      if (isApplications) await deleteApplicationFn({ data: { id: row.id } });
      else await deleteSection({ data: { section: section as "events" | "rules" | "results" | "officials" | "homepage", id: row.id } as any });
      toast.success("Deleted");
      void qc.invalidateQueries({ queryKey: ["cms-section", section] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't delete this item"); }
  }
  async function saveApplication(row: any) {
    try {
      await saveApplicationFn({ data: { id: row.id, status: row.status, internal_notes: row.internal_notes ?? "" } });
      toast.success("Application updated"); setEditing(null); void qc.invalidateQueries({ queryKey: ["cms-section", section] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't update application"); }
  }
  async function reorderOfficial(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const reordered = [...data];
    const from = reordered.findIndex((r: any) => r.id === draggingId);
    const to = reordered.findIndex((r: any) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [item] = reordered.splice(from, 1); reordered.splice(to, 0, item);
    try {
      await reorderOfficialsFn({ data: { ids: reordered.map((r: any) => r.id) } });
      toast.success("Display order saved");
      void qc.invalidateQueries({ queryKey: ["cms-section", section] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't save the new order"); }
    setDraggingId(null);
  }
  async function exportCsv() {
    const keys = ["id", "organisation_name", "country", "region", "contact_name", "contact_role", "email", "phone", "website", "membership_type", "status", "internal_notes", "created_at"];
    const csv = [keys.join(","), ...visibleRows.map((r: any) => keys.map((k) => `"${String(r[k] ?? "").replaceAll('"', '""')}"`).join(","))].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "membership-applications.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  const title = isApplications ? "Membership applications" : cfg!.title;
  const empty = () => section === "homepage" ? { id: true } : section === "rules" ? { kind: "document", visible: true, accent: "#4298D3", tone: "neutral", display_order: 0, content: "", availability: "", description: "", download_url: "" } : { status: "draft", visible: false, description: "[]", rows: "[]", sections: "[]" };
  const loadError = error as { code?: string; message?: string } | null;
  const missingSchema = !!loadError && (["42P01", "PGRST204", "PGRST205"].includes(loadError.code ?? "") || /schema cache|does not exist/i.test(loadError.message ?? ""));
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
      {isApplications ? <button onClick={exportCsv} className="min-h-10 rounded-md px-4 text-sm font-bold text-white" style={{ background: IYSF.blue }}>Export CSV</button> : (section !== "homepage" || data.length === 0) && <button onClick={() => setEditing(empty())} className="min-h-10 rounded-md px-4 text-sm font-bold text-white" style={{ background: IYSF.magenta }}>{section === "homepage" ? "Create homepage settings" : `New ${section === "officials" ? "official" : section.slice(0, -1)}`}</button>}
    </div>
    <div className={`mt-4 grid gap-2 ${isApplications || section === "events" || section === "results" ? "sm:grid-cols-[1fr_auto]" : ""}`}><input className="min-h-10 rounded-md border px-3 text-sm" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      {(isApplications || section === "events" || section === "results") && <select aria-label="Status filter" className="min-h-10 rounded-md border bg-white px-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{(isApplications ? ["new", "reviewed", "approved", "rejected"] : ["draft", "published"]).map((s) => <option key={s}>{s}</option>)}</select>}</div>
    {error && <p role="alert" className="mt-4 text-sm text-pink-700">{missingSchema ? `Couldn't load ${title.toLowerCase()}. Apply database migration ${section === "rules" ? "0006" : "0004"} first.` : `Couldn't load ${title.toLowerCase()}: ${loadError?.message ?? "unknown error"}`}</p>}
    {isLoading ? <p className="mt-5 text-sm">Loading…</p> : <ul className="mt-4 space-y-2">{visibleRows.map((r: any) => <li key={r.id} draggable={section === "officials"} onDragStart={() => setDraggingId(r.id)} onDragOver={(e) => { if (section === "officials") e.preventDefault(); }} onDrop={() => section === "officials" && void reorderOfficial(r.id)} className={`rounded-xl border bg-white p-4 ${section === "officials" ? "cursor-move" : ""}`} style={{ borderColor: IYSF.blueLine }}>
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-bold">{isApplications ? r.organisation_name ?? r.email ?? "Application" : r.title ?? r.competition_name ?? r.name ?? "Homepage settings"}</h2><p className="mt-1 text-xs capitalize opacity-70">{r.status ?? (r.visible ? "visible" : "hidden")} {r.country ? `· ${r.country}` : ""} {r.created_at ? `· ${new Date(r.created_at).toLocaleString()}` : ""}</p></div>
        <div className="flex gap-3 text-sm font-semibold"><button onClick={() => setEditing({ ...r, ...(cfg ? Object.fromEntries(cfg.fields.filter((f) => f.type === "textarea" || ["sections", "rows", "description"].includes(f.key)).map((f) => [f.key, typeof r[f.key] === "string" ? r[f.key] : JSON.stringify(r[f.key] ?? [], null, 2)])) : {}) })} style={{ color: IYSF.blue }}>Edit</button><button onClick={() => void remove(r)} style={{ color: IYSF.magenta }}>Delete</button></div></div>
      {isApplications && editing?.id === r.id && <div className="mt-4 space-y-3"><pre className="overflow-auto rounded bg-black/5 p-3 text-xs">{JSON.stringify(r, null, 2)}</pre><select className="min-h-10 rounded-md border px-3" value={editing!.status} onChange={(e) => setEditing({ ...editing!, status: e.target.value })}>{["new", "reviewed", "approved", "rejected"].map((s) => <option key={s}>{s}</option>)}</select><textarea className="block min-h-24 w-full rounded-md border p-3 text-sm" placeholder="Internal notes" value={editing!.internal_notes ?? ""} onChange={(e) => setEditing({ ...editing!, internal_notes: e.target.value })} /><button onClick={() => void saveApplication(editing)} className="rounded-md px-4 py-2 text-sm font-bold text-white" style={{ background: IYSF.magenta }}>Save</button></div>}
    </li>)}</ul>}
    {!isLoading && !error && !visibleRows.length && <p className="mt-6 text-sm opacity-70">{data.length ? `No matching ${title.toLowerCase()}.` : `No ${title.toLowerCase()} yet.`}</p>}
    {editing && !isApplications && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-3 sm:p-8"><div role="dialog" aria-modal="true" className="mx-auto my-4 max-w-2xl rounded-xl bg-white p-5"><h2 className="text-xl font-bold">{editing!.id ? "Edit" : "New"} {title}</h2><p className="mt-1 text-xs opacity-70" aria-live="polite">{saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Draft changes autosave every 30 seconds."}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{cfg!.fields.map((f) => <label key={f.key} className={`text-sm font-semibold ${f.type === "textarea" ? "sm:col-span-2" : ""}`}>{f.label}
      {f.type === "checkbox" ? <input type="checkbox" className="ml-2" checked={!!editing[f.key]} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} /> : f.key === "status" ? <select className="mt-1 min-h-10 w-full rounded-md border px-3 font-normal" value={editing[f.key] ?? "draft"} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}><option>draft</option><option>published</option></select> : f.type === "textarea" ? <textarea className="mt-1 min-h-28 w-full rounded-md border p-3 font-normal" value={typeof editing[f.key] === "string" ? editing[f.key] : JSON.stringify(editing[f.key] ?? [], null, 2)} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} /> : <><input type={f.type ?? "text"} className="mt-1 min-h-10 w-full rounded-md border px-3 font-normal" value={f.type === "datetime-local" ? datetimeLocal(editing[f.key]) : editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />{["cover_image_url", "photo_url", "hero_image_url", "official_sheet_url"].includes(f.key) && <button type="button" onClick={() => setMediaField(f.key)} className="mt-1 text-xs font-bold" style={{ color: IYSF.blue }}>Choose from media library</button>}</>}</label>)}</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setEditing(null)} className="min-h-10 rounded-md border px-4 text-sm">Cancel</button><button onClick={() => void save()} className="min-h-10 rounded-md px-4 text-sm font-bold text-white" style={{ background: IYSF.magenta }}>Save</button></div></div></div>}
    {mediaField && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"><div role="dialog" aria-modal="true" aria-label="Choose media" className="max-h-[85dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white p-4 sm:rounded-xl"><div className="mb-3 flex justify-between font-bold">Media library<button onClick={() => setMediaField(null)} className="text-sm">Close</button></div><MediaLibrary onPick={(item) => { setEditing((v) => v ? { ...v, [mediaField]: item.url, ...(mediaField === "cover_image_url" ? { cover_alt: v.cover_alt || item.alt || "" } : {}) } : v); setMediaField(null); }} /></div></div>}
  </div>;
}
