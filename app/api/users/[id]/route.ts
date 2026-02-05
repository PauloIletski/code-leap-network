import {supabase} from '@/lib/supabase';
import {NextResponse} from 'next/server';

export async function GET(request:Request, {params}: {params: Promise<{id: string}>}) {
    try{
        const {id} = await params;
        const {data, error} = await supabase.from("users").select("*").eq("id", id);

        if (error)
            throw error;

        return NextResponse.json({user: data}, {status: 200});
    }catch(error){
        return NextResponse.json({error: error instanceof Error ? error.message : "Unknown error occurred"}, {status: 500});
    }
}