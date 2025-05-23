import { NextResponse } from "next/server";
import { ADMIN_SECRET_KEY } from "@/config/secret";

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    if (secret === ADMIN_SECRET_KEY) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } else {
      return NextResponse.json({ authenticated: false, message: "Invalid secret" }, { status: 401 });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}