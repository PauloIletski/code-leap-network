import {supabase} from "@/lib/supabase"
import {NextResponse} from "next/server"


export async function GET() {
    try {
        const {data,error} = await supabase.from("users").select("*")
        if (error)
            throw error
        return NextResponse.json({users: data}, {status: 200})
    }catch (error) {
        return NextResponse.json(
            {error:error instanceof Error ? error.message : "Unknown error occurred"},
            {status: 500}
        )
    }

}

export async function POST(request: Request) {
    try{
       const body = await request.json()

       const {data,error} = await supabase.from("users").insert(body).select()
         if (error)
             throw error
        
         return NextResponse.json({user: data}, {status: 201})
    }
    catch (error) {
        return NextResponse.json(
            {error:error instanceof Error ? error.message : "Unknown error occurred"},
            {status: 500}
        )
    }
}
