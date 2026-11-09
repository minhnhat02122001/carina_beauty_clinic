import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { isValidSignature } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  revalidatePath("/", "layout");
  return Response.json({ revalidated: true });
}
