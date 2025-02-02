import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IK_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IK_URL_ENDPOINT!,
});

export async function GET(_request: Request) {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
