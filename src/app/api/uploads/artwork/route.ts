import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase, getServiceSupabase } from "@/server/supabase";
import { MAX_IMAGE_BYTES } from "@/lib/constants";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const STORAGE_BUCKET = "artwork-uploads";

/**
 * Upload an artwork image to Supabase Storage and return a public URL.
 *
 * Falls back to a base64 data URL (encoded server-side) when Supabase storage
 * isn't reachable or hasn't been provisioned yet, so artists can still preview
 * the upload flow in local development.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG or WEBP." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "File is too large." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!hasServerSupabase()) {
    return NextResponse.json({
      url: `data:${file.type};base64,${buffer.toString("base64")}`,
      stored: false,
    });
  }

  try {
    const supabase = getServiceSupabase();
    const path = `${user?.id ?? "anonymous"}/${Date.now()}-${sanitizeName(file.name)}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });
    if (error) throw error;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, stored: true });
  } catch (err) {
    // Bucket might not exist or storage might not be enabled. Fall back so
    // the artist can still keep moving through the flow.
    console.error("artwork upload failed", err);
    return NextResponse.json({
      url: `data:${file.type};base64,${buffer.toString("base64")}`,
      stored: false,
      warning: "Storage not configured — using inline preview only.",
    });
  }
}

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
}
