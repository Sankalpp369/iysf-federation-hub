import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from "../../components/news-article";
import { IYSF } from "../../components/site-chrome";

export const Route = createFileRoute("/_authenticated/admin/preview/$id")({ component: Preview });

function Preview() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["preview", id],
    queryFn: async () => (await supabase.from("posts").select("*").eq("id", id).maybeSingle()).data,
  });
  if (isLoading) return <div className="h-64 animate-pulse rounded bg-black/5" />;
  if (!data) return <p>Post not found.</p>;
  return (
    <div className="-m-4 bg-white md:-m-8">
      <div className="px-4 py-2 text-center text-xs font-bold text-white" style={{ background: IYSF.orange }}>
        Preview — {data.status}. Visitors {data.status === "published" ? "can" : "cannot"} see this yet.
      </div>
      <NewsArticle post={data} preview />
    </div>
  );
}
