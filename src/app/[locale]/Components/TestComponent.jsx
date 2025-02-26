"use client";

import { sendMail } from "../Utils/Mail";
import { OrderPlacedEmailTemplate } from "../Utils/MailTemplates";
import { apiUrl, siteLogo, siteName, woocommerceKey } from "../Utils/variables";

export default function TestComponent() {



  const testOrder = async (e) => {
    const orderInfo = {
      payment_method: "bacs", // Payment method, such as bacs (direct bank transfer)
      payment_method_title: "Direct Bank Transfer", // Title to display for the payment method
      set_paid: true, // Whether the order is paid (true/false)
      billing: {
        first_name: "test",
        last_name: "Doe",
        address_1: "1234 Main Street",
        address_2: "",
        city: "Cityville",
        state: "CA",
        postcode: "90210",
        country: "US",
        email: "john.doe@example.com",
        phone: "+1234567890",
      },
      shipping: {
        first_name: "John",
        last_name: "Doe",
        address_1: "1234 Main Street",
        address_2: "",
        city: "Cityville",
        state: "CA",
        postcode: "90210",
        country: "US",
      },
      line_items: [
        {
          product_id: 123, // ID of the product
          quantity: 1, // Number of items
        },
      ],
      shipping_lines: [
        {
          method_id: "flat_rate", // Shipping method ID
          method_title: "Flat Rate", // Shipping method title
          total: "10", // Shipping cost
        },
      ],
    };

    try {
      // Submit the review
      const response = await fetch(
        `${apiUrl}wp-json/wc/v3/orders${woocommerceKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: jwtTocken, // Replace with JWT or Basic Auth
          },
          body: JSON.stringify(orderInfo),
        }
      );

      if (response.ok) {
        //MAIL NOTIFICATION TO USER

        await sendMail({
          sendTo: "upturnistuae@gmail.com",
          subject: `You Have Successfully Ordered`,
          name: "Muhammed",
          message: OrderPlacedEmailTemplate(siteLogo),
        });

    
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to submit review",
          response.status,
          errorResponse
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
    }
  };

  return (
    <button className="btn btn-light btn-large" onClick={testOrder}>
      test order
    </button>
  );
}
