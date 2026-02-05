import {supabase} from "@/lib/supabase"
import {NextResponse} from "next/server"    


export async function GET() {
    try {
        const {data,error} = await supabase.from("posts")
        .select(`
           id,
           title,
           content,
           created_at,
           user_id,
           users (id, username)
        `)
        .order('created_at', {ascending: false});

        if (error) return NextResponse.json({ error }, { status: 500 });
        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}