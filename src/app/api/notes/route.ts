export async function POST(req: Request){
    try {
        const body = await req.json()
    } catch (error) {
        console.log(error)
        return Response.json({error: 'Internal server error'}, {status: 500})
    }
}