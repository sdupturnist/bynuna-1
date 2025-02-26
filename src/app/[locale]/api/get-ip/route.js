// app/api/get-ip/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',').shift() ||
             req.connection.remoteAddress || 
             req.socket.remoteAddress;

  return NextResponse.json({ ip });
}
