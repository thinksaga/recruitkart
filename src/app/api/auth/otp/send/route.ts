import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { type, value } = await req.json();

        // In a real app, we would send an SMS or Email here.
        // For now, we just log it.
        console.log(`Sending OTP for ${type}: ${value}`);

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
