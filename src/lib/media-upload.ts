import { supabase } from "@/integrations/supabase/client";

export const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_BYTES = 5 * 1024 * 1024;
const MAX_W = 2000;

async function compress(file: File): Promise<{ blob: Blob; width: number; height: number; type: string }> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return { blob: file, width: 0, height: 0, type: file.type };
  const { width, height } = bmp;
  if (width <= MAX_W && file.size < 1024 * 1024) return { blob: file, width, height, type: file.type };
  const scale = Math.min(1, MAX_W / width);
  const w = Math.round(width * scale), h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob || blob.size >= file.size) return { blob: file, width, height, type: file.type };
  return { blob, width: w, height: h, type: "image/webp" };
}

export async function uploadMedia(file: File, alt = "") {
  if (!ACCEPTED.includes(file.type)) throw new Error("Only JPG, PNG, WebP or AVIF images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Images must be 5 MB or smaller.");
  const { blob, width, height, type } = await compress(file);
  const ext = type.split("/")[1].replace("jpeg", "jpg");
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "image";
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: type, upsert: false });
  if (error) throw new Error(error.message);
  const url = `/api/public/media/${path}`;
  const { data: u } = await supabase.auth.getUser();
  const { data, error: dbErr } = await supabase
    .from("media")
    .insert({ path, url, alt, width, height, size_bytes: blob.size, mime_type: type, uploaded_by: u.user?.id })
    .select()
    .single();
  if (dbErr) throw new Error(dbErr.message);
  return data;
}
