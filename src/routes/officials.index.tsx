import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { safeImageSrc } from "@/lib/blocks";
import { Nav, Footer, IYSF } from "../components/site-chrome";

export const Route = createFileRoute("/officials/")({
  head: () => ({ meta: [{ title: "IYSF Officials" }, { name: "description", content: "Meet IYSF officials and committee members." }] }),
  component: OfficialsPage,
});
function OfficialsPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["public-officials"], queryFn: async () => {
    const { data, error } = await (supabase as any).from("cms_officials").select("id,name,role_title,country,photo_url,bio,display_order").eq("visible", true).order("display_order", { ascending: true });
    if (error) throw error; return data ?? [];
  } });
  const groups = data.reduce((a: Record<string, any[]>, o: any) => ((a[o.role_title] ??= []).push(o), a), {});
  return <div className="min-h-screen bg-white" style={{ color: IYSF.charcoal }}><Nav /><main><header style={{ background: IYSF.blueWash }}><div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-20"><p className="text-xs font-bold uppercase tracking-widest" style={{ color: IYSF.blue }}>Federation leadership</p><h1 className="mt-3 text-4xl font-extrabold md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>IYSF Officials</h1></div></header><div className="mx-auto max-w-[1100px] px-5 py-10 md:px-8">{isLoading && <p>Loading officials…</p>}{error && <p>Officials are temporarily unavailable.</p>}{!isLoading && !data.length && <p className="text-sm opacity-70">No officials have been published yet.</p>}{Object.entries(groups).map(([role, people]) => <section key={role} className="mb-10"><h2 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{role}</h2><ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(people as any[]).map((p) => { const photo = safeImageSrc(p.photo_url ?? ""); return <li key={p.id} className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: IYSF.blueLine }}>{photo && <img src={photo} alt={p.name} width={600} height={600} className="aspect-square w-full object-cover" loading="lazy" decoding="async" />}<div className="p-4"><h3 className="font-bold">{p.name}</h3><p className="text-sm" style={{ color: IYSF.blue }}>{p.country}</p>{p.bio && <p className="mt-2 text-sm leading-relaxed">{p.bio}</p>}</div></li>; })}</ul></section>)}</div></main><Footer /></div>;
}
