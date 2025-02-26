import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  
  // Get cart length from the cookie
  const cartLength = cookieStore.get('cartItemsLength') || 0;
  
  return new Response(JSON.stringify({ cartLength }), {
    status: 200,
  });
}

export async function POST(request) {
  const { cartItemsLength } = await request.json();
  const cookieStore = cookies();
  
  // Set or update the cookie with the cart length
  cookieStore.set('cartItemsLength', cartItemsLength.toString(), {
    path: '/',
    httpOnly: true, // Secure the cookie
    secure: process.env.NODE_ENV === 'production', // Secure in production only
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // Expire in 7 days
  });
  
  return new Response(JSON.stringify({ message: 'Cart length cookie set!' }), {
    status: 200,
  });
}
