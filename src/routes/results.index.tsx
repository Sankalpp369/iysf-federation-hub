import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav, Footer, IYSF } from "../components/site-chrome";

export const Route = createFileRoute("/results/")({
  head: () => ({ meta: [{ title: "Championship Results | IYSF" }, { name: "description", content: "Standings and results from IYSF championships." }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const { data = [], isLoading, error } = useQuery({ queryKey: ["public-cms-results"], queryFn: async () => {
    const { data, error } = await (supabase as any).from("cms_results").select("id,competition_name,slug,competition_date,location,category").eq("status", "published").order("competition_date", { ascending: false });
    if (error) throw error; return (data ?? []) as Array<{ id: string; competition_name: string; slug: string; competition_date: string; location: string; category: string | null }>;
  } });
  const years = [...new Set(data.map((r: any) => String(r.competition_date).slice(0, 4)))];
  const rows = useMemo(() => data.filter((r: any) => `${r.competition_name} ${r.location} ${r.category}`.toLowerCase().includes(query.toLowerCase()) && (year === "all" || String(r.competition_date).startsWith(year))), [data, query, year]);
  return <div className="min-h-screen bg-white" style={{ color: IYSF.charcoal }}><Nav /><main>
    <header style={{ background: IYSF.blueWash }}><div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-20"><p className="text-xs font-bold uppercase tracking-[.2em]" style={{ color: IYSF.blue }}>Competition archive</p><h1 className="mt-3 text-4xl font-extrabold md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>Championship Results</h1><p className="mt-4 max-w-2xl">Browse published competition results by event, category and year.</p></div></header>
    <section className="mx-auto max-w-[1100px] px-5 py-10 md:px-8"><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><input aria-label="Search results" placeholder="Search competitions, locations, categories" value={query} onChange={(e) => setQuery(e.target.value)} className="min-h-11 rounded-md border px-3" /><select aria-label="Year" className="min-h-11 rounded-md border bg-white px-3" value={year} onChange={(e) => setYear(e.target.value)}><option value="all">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></div>
      {isLoading && <p className="mt-6">Loading results…</p>}{error && <p className="mt-6">Results are temporarily unavailable.</p>}
      {!isLoading && rows.length === 0 && <p className="mt-6 text-sm opacity-70">No published results match your search.</p>}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">{rows.map((r: any) => <li key={r.id} className="rounded-xl border bg-white p-5" style={{ borderColor: IYSF.blueLine }}><time className="text-xs font-bold uppercase" style={{ color: IYSF.magenta }}>{new Date(`${r.competition_date}T00:00:00`).toLocaleDateString()}</time><h2 className="mt-2 text-xl font-bold">{r.competition_name}</h2><p className="mt-1 text-sm">{r.location}{r.category ? ` · ${r.category}` : ""}</p><Link to="/results/$slug" params={{ slug: r.slug }} className="mt-3 inline-block text-sm font-bold" style={{ color: IYSF.blue }}>View results →</Link></li>)}</ul>
    </section>
  </main><Footer /></div>;
}
