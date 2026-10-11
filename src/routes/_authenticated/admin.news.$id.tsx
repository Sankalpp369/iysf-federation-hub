import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostEditor } from "../../components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/news/$id")({ component: EditPost });

function EditPost() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
  if (isLoading) return <div className="space-y-3"><div className="h-10 w-2/3 animate-pulse rounded bg-black/5" /><div className="h-64 animate-pulse rounded bg-black/5" /></div>;
  if (error || !data) return <p>Post not found. <Link to="/admin/news" className="underline">Back to news</Link></p>;
  return <PostEditor key={data.id} post={data} />;
}
