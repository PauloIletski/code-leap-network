import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(
    request:Request,
    {params}: {params: Promise<{id: string}>}
){
    try{
        const {id} = await params;
        const body = await request.json();
        const {data, error} = await supabase.from("posts").update(body).eq("id", id).select();

        if (error)
            throw error;

        return NextResponse.json({post: data}, {status: 200});   
    }
    catch (error) {
      
         console.log("Error updating post:", error);

        return NextResponse.json(
            {error:error instanceof Error ? error.message : "Unknown error occurred"},
            {status: 500}
        )
    }
}