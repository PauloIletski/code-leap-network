import {supabase} from "@/lib/supabase";
import {NextResponse} from "next/server";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("id");

        const { error } = await supabase.from("posts").delete().eq("id", postId);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error occurred" },
            { status: 500 }
        );
    }
}