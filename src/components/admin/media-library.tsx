import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, ACCEPTED } from "@/lib/media-upload";
import { IYSF } from "../site-chrome";
import { createMediaRecord, deleteMedia as deleteMediaAction } from "@/lib/cms.functions";

export type MediaRow = { id: string; path: string; url: string; alt: string | null; created_at: string };

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("id,path,url,alt,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data as MediaRow[];
    },
  });
}

export function MediaLibrary({ onPick }: { onPick?: (m: MediaRow) => void }) {
  const qc = useQueryClient();
  const createMedia = useServerFn(createMediaRecord);
  const deleteMedia = useServerFn(deleteMediaAction);
  const { data, isLoading, error } = useMedia();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      try {
        const uploaded = await uploadMedia(f);
        let m: MediaRow;
        try {
          m = await createMedia({ data: uploaded }) as MediaRow;
        } catch (error) {
          await supabase.storage.from("media").remove([uploaded.path]);
          throw error;
        }
        toast.success(`Uploaded ${f.name}`);
        if (onPick && files.length === 1) onPick(m as MediaRow);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setBusy(false);
    void qc.invalidateQueries({ queryKey: ["media"] });
    if (input.current) input.current.value = "";
  }

  async function remove(m: MediaRow) {
    if (!confirm("Delete this image? Posts using it will show no image.")) return;
    try { await deleteMedia({ data: { id: m.id } }); toast.success("Image deleted"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't delete image"); }
    void qc.invalidateQueries({ queryKey: ["media"] });
  }

  return (
    <div>
      <input ref={input} type="file" accept={ACCEPTED.join(",")} multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: IYSF.blue }}>
        <Upload size={16} aria-hidden="true" /> {busy ? "Uploading…" : "Upload images"}
      </button>
      <p className="mt-2 text-xs opacity-70">JPG, PNG, WebP or AVIF, up to 5 MB. Large images are resized to 2000px wide.</p>
      {error && <p className="mt-4 text-sm" style={{ color: IYSF.magenta }}>Couldn't load media.</p>}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-black/5" />)}
        {data?.map((m) => (
          <div key={m.id} className="group relative overflow-hidden rounded-lg border" style={{ borderColor: IYSF.blueLine }}>
            {onPick ? (
              <button type="button" onClick={() => onPick(m)} className="block w-full" aria-label="Use this image">
                <img src={m.url} alt={m.alt ?? ""} loading="lazy" className="aspect-square w-full object-cover" />
              </button>
            ) : (
              <img src={m.url} alt={m.alt ?? ""} loading="lazy" className="aspect-square w-full object-cover" />
            )}
            {!onPick && (
              <button type="button" onClick={() => remove(m)} aria-label="Delete image" className="absolute right-1.5 top-1.5 rounded-md bg-white/90 p-1.5" style={{ color: IYSF.magenta }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {data?.length === 0 && <p className="col-span-full text-sm opacity-70">No images yet.</p>}
      </div>
    </div>
  );
}
