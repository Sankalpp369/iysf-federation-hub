import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IYSF } from "../../components/site-chrome";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const c = async (status?: string) => {
        let q = supabase.from("posts").select("id", { count: "exact", head: true });
        if (status) q = q.eq("status", status);
        return (await q).count ?? 0;
      };
      const media = (await supabase.from("media").select("id", { count: "exact", head: true })).count ?? 0;
      return { total: await c(), published: await c("published"), drafts: await c("draft"), scheduled: await c("scheduled"), media };
    },
  });
  const cards = [
    { label: "Published posts", v: data?.published },
    { label: "Drafts", v: data?.drafts },
    { label: "Scheduled", v: data?.scheduled },
    { label: "Images", v: data?.media },
  ];
  return (
    <div>
      <h1 className="text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4" style={{ borderColor: IYSF.blueLine }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: IYSF.blue }}>{c.label}</div>
            {isLoading ? <div className="mt-2 h-8 w-12 animate-pulse rounded bg-black/5" /> : <div className="mt-1 text-3xl font-extrabold">{c.v}</div>}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/admin/news/new" className="inline-flex min-h-11 items-center rounded-[10px] px-4 text-sm font-bold text-white" style={{ background: IYSF.magenta }}>New post</Link>
        <Link to="/admin/media" className="inline-flex min-h-11 items-center rounded-[10px] border-2 px-4 text-sm font-bold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>Media library</Link>
      </div>
    </div>
  );
}
