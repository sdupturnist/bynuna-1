import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';  // Built-in crypto module

export async function POST(req) {
  // Step 1: Parse the incoming request data (this would be sent by your frontend)
  const { order, customer, billing_address } = await req.json();

  // Ensure all fields are provided
  if (!order || !customer || !billing_address) {
    return NextResponse.json({
      success: false,
      message: 'Missing required fields: order, customer, or billing_address',
    });
  }

  // Set merchant credentials (use real keys in production)
  const merchant_key = 'cb6b074c-7b0f-11ee-9995-5af3283cdfeb';  // Test Merchant Key
  const merchant_pass = 'be80eebd9f33e214ad7019a70ffd86f9';  // Merchant Password
  const payment_public_id = 'public-id-xyz'; // Payment Public ID (replace with actual)

  // Step 2: Construct the hash string exactly as described:
  // payment_public_id + order.number + order.amount + order.currency + order.description + merchant_pass
  const hashString = `${payment_public_id}${order.number}${order.amount}${order.currency}${order.description}${merchant_pass}`;

  // Log the string we are hashing for debugging purposes
 

  // Step 3: Apply MD5 encoding to the string
  const md5Hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  
  // Step 4: Generate the SHA1 hash of the MD5-encoded string
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex').toUpperCase();
 
  // Step 5: Prepare the request data to create the payment session
  const data = {
    merchant_key,  // Merchant key (your identifier)
    operation: 'purchase',  // Operation type (purchase)
    methods: ['card'],  // Payment method(s), here it’s just 'card' but can include others
    session_expiry: 60,  // Session expiration in minutes
    order,  // Order details like number, amount, currency, description
    cancel_url: 'https://example.domain.com/cancel',  // URL to redirect on cancel
    success_url: 'https://example.domain.com/success',  // URL to redirect on success
    expiry_url: 'https://example.domain.com/expiry',  // URL to redirect if session expires
    url_target: '_self',  // URL target (either '_self' or '_blank')
    customer,  // Customer details (name, email, etc.)
    billing_address,  // Billing address
    card_token: [],  // Optional: Provide card token if using tokenized cards
    req_token: true,  // Whether a token is requested for the session
    recurring_init: true,  // Whether to initialize recurring payments
    schedule_id: '9d0f5cc4-f07b-11ec-abf4-0242ac120006',  // Example schedule ID for recurring payments
    hash: sha1Hash,  // The correct hash to validate the request
  };


  try {
    // Step 6: Make a POST request to TotalPay API to create the session
    const response = await axios.post('https://checkout.totalpay.global/api/v1/session', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Step 7: Handle the response from TotalPay API
    const { data: responseData } = response;

    if (responseData.error_code === 0) {
      // If the response is successful, return the payment URL to redirect the user
      return NextResponse.json({
        success: true,
        payment_url: responseData.payment_url,
      });
    } else {
      // If an error occurs, return the error message
      return NextResponse.json({
        success: false,
        message: responseData.error_message,
      });
    }
  } catch (error) {
    console.error('TotalPay API error:', error.response?.data || error.message);  // Log the error response
    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}
