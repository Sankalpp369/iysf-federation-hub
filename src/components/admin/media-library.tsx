import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, ACCEPTED } from "@/lib/media-upload";
import { IYSF } from "../site-chrome";
import { createMediaRecord, deleteMedia as deleteMediaAction, updateMediaAlt } from "@/lib/cms.functions";

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
  const saveMediaAlt = useServerFn(updateMediaAlt);
  const { data, isLoading, error } = useMedia();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [editingAlt, setEditingAlt] = useState<{ id: string; alt: string } | null>(null);

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

  async function saveAlt() {
    if (!editingAlt) return;
    try {
      await saveMediaAlt({ data: { id: editingAlt.id, alt: editingAlt.alt.trim() || null } });
      toast.success("Alt text saved");
      setEditingAlt(null);
      await qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update alt text");
    }
  }

  return (
    <div>
      <input ref={input} type="file" accept={ACCEPTED.join(",")} multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: IYSF.blue }}>
        <Upload size={16} aria-hidden="true" /> {busy ? "Uploading…" : "Upload images"}
      </button>
      <p className="mt-2 text-xs opacity-70">JPG, PNG, WebP or AVIF, up to 5 MB. Large images are resized to 2000px wide.</p>
      {error && <p role="alert" className="mt-4 text-sm" style={{ color: IYSF.magenta }}>Couldn't load media: {error instanceof Error ? error.message : "unknown error"}</p>}
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
              <div className="space-y-2 p-2">
                {editingAlt?.id === m.id ? <div className="space-y-2">
                  <label className="block text-xs font-semibold">Alt text<input autoFocus value={editingAlt.alt} onChange={(e) => setEditingAlt({ ...editingAlt, alt: e.target.value })} className="mt-1 min-h-10 w-full rounded border px-2 text-sm font-normal" maxLength={500} /></label>
                  <div className="flex gap-2"><button type="button" onClick={() => void saveAlt()} className="min-h-9 rounded px-2 text-xs font-bold text-white" style={{ background: IYSF.blue }}>Save</button><button type="button" onClick={() => setEditingAlt(null)} className="min-h-9 rounded border px-2 text-xs">Cancel</button></div>
                </div> : <button type="button" onClick={() => setEditingAlt({ id: m.id, alt: m.alt ?? "" })} className="min-h-9 text-xs font-semibold" style={{ color: IYSF.blue }}>Edit alt text</button>}
                <button type="button" onClick={() => void remove(m)} aria-label="Delete image" className="absolute right-1.5 top-1.5 rounded-md bg-white/90 p-1.5" style={{ color: IYSF.magenta }}>
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
        {data?.length === 0 && <p className="col-span-full text-sm opacity-70">No images yet.</p>}
      </div>
    </div>
  );
}
