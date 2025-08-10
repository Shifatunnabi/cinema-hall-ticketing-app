import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string | null) || "cinema/posters";

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary env vars not set (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)",
        },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Build signature string (alphabetical order of params, exclude file, api_key, signature)
    const params: Record<string, string> = { timestamp };
    if (folder) params.folder = folder;

    const toSign =
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + apiSecret;

    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    // Send to Cloudinary
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", apiKey);
    body.append("timestamp", timestamp);
    body.append("signature", signature);
    if (folder) body.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body,
      }
    );

    const json = await uploadRes.json();
    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: json?.error?.message || "Upload failed" },
        { status: uploadRes.status }
      );
    }

    // Return the essential fields
    return NextResponse.json({
      asset_id: json.asset_id,
      public_id: json.public_id,
      secure_url: json.secure_url,
      width: json.width,
      height: json.height,
      format: json.format,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
