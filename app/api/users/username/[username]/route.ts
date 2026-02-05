import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    console.log("Fetching user with username:", username);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (error) throw error;

    return NextResponse.json({ user: data[0] }, { status: 200 });
  } catch (error) {
    console.log("Error fetching user:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
