import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav, Footer, IYSF } from "../components/site-chrome";

export const Route = createFileRoute("/results/$slug")({ component: ResultDetail });
function ResultDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({ queryKey: ["public-cms-result", slug], queryFn: async () => {
    const { data, error } = await (supabase as any).from("cms_results").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error; return data;
  } });
  const resultRows = Array.isArray(data?.rows) ? data.rows : [];
  return <div className="min-h-screen bg-white" style={{ color: IYSF.charcoal }}><Nav /><main className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
    <Link to="/results" className="text-sm font-bold" style={{ color: IYSF.blue }}>← All results</Link>
    {isLoading ? <p className="mt-6">Loading…</p> : error || !data ? <h1 className="mt-6 text-3xl font-extrabold">Results not found</h1> : <><p className="mt-6 text-xs font-bold uppercase tracking-widest" style={{ color: IYSF.magenta }}>{new Date(`${data.competition_date}T00:00:00`).toLocaleDateString()}</p><h1 className="mt-2 text-3xl font-extrabold md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{data.competition_name}</h1><p className="mt-3">{data.location}{data.category ? ` · ${data.category}` : ""}</p><div className="mt-8 overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left text-sm"><thead><tr className="border-b" style={{ borderColor: IYSF.blueLine }}>{["Rank", "Athlete", "Country", "Score"].map((x) => <th key={x} className="p-3">{x}</th>)}</tr></thead><tbody>{resultRows.map((r: any, i: number) => <tr key={i} className="border-b" style={{ borderColor: IYSF.blueLine }}><td className="p-3">{r.rank}</td><td className="p-3 font-semibold">{r.athlete_name ?? r.athlete}</td><td className="p-3">{r.country}</td><td className="p-3">{r.score}</td></tr>)}</tbody></table></div>{data.official_sheet_url && <a href={data.official_sheet_url} className="mt-5 inline-block font-bold" style={{ color: IYSF.magenta }} target="_blank" rel="noreferrer">Official score sheet →</a>}</>}
  </main><Footer /></div>;
}
