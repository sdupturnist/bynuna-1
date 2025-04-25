"use client";

import { useSiteContext } from "../Context/siteContext";
import { convertCurrency, formatDateString, siteName } from "./variables";




export let OrderPlacedEmailTemplate = (
  siteLogo,
  billingAddress,
  cartItems,
  orderId,
  paymentMethodOption,
  email,
  paymentid,
  discount,
  cartSubTotal,
  shippingChargeFinal,
  eligibleFreeShipping,
  activeCurrencySymbol,
  vat,
  vatAmount,
  finalDiscount,
  currency,
  orderStatus,
  payAmount
) => {
  let today = new Date();


  // Mapping cart items into a string of <tr> for the table
  const orderItems = cartItems
    .map(
      (item, index) =>
        `<tr>
      <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px">${
        item?.name
      }</td>
      <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">${
        item?.quantity
      }</td>
      <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${item?.price}</td>
      <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${(item?.price * item?.quantity)}
     </td>
    </tr>`
    )
    .join(""); // Make sure to join all items into one string

  const item = `
  <p style="margin-top:0px;margin-bottom:20px">Thank you for your interest in ${siteName}. Your order has been received.</p>
  
  <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
    <thead>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222" colspan="2">Order Details</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px"><b>Order ID:</b> ${orderId}<br>
          <b>Date Added:</b> ${formatDateString(today)}<br>
          <b>Payment Method:</b> ${paymentMethodOption}<br>
          <b>Shipping Method:</b> ${
            eligibleFreeShipping === false ? "Flat Rate" : "<span style='color:green;'>Free Shipping</span>"
          }</td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px"><b>E-mail:</b><a href="mailto:${
          email 
        }" target="_blank">${email || '-'}</a><br>
          <b>Telephone:</b> ${billingAddress?.phone || '-'}<br>
          <b>Order Status:</b> ${orderStatus}<br></td>
      </tr>
    </tbody>
  </table>
  
  <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
    <thead>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222">Instructions</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px">Payment Successful. ${paymentMethodOption} ${paymentid}</td>
      </tr>
    </tbody>
  </table>
  
  <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
    <thead>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222">Payment Address</td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222">Shipping Address</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px">
        ${billingAddress?.firstName || billingAddress?.first_name || ''}<br>
          ${billingAddress?.houseName || billingAddress?.address_1 || ''}<br>
          ${billingAddress?.street}<br>
        ${billingAddress?.city}<br>
        ${billingAddress?.state}<br>
        ${billingAddress?.country}
        </td>


        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:left;padding:7px">
         ${billingAddress?.firstName || billingAddress?.first_name || ''}<br>
          ${billingAddress?.houseName || billingAddress?.address_1 || ''}<br>
          ${billingAddress?.street}<br>
        ${billingAddress?.city}<br>
        ${billingAddress?.state}<br>
        ${billingAddress?.country}
        </td>


      </tr>
    </tbody>
  </table>
  
  <table style="border-collapse:collapse;width:100%;border-top:1px solid #dddddd;border-left:1px solid #dddddd;margin-bottom:20px">
    <thead>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:left;padding:7px;color:#222222">Product</td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:right;padding:7px;color:#222222">Quantity</td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:right;padding:7px;color:#222222">Price</td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;background-color:#efefef;font-weight:bold;text-align:right;padding:7px;color:#222222">Total</td>
      </tr>
    </thead>
    <tbody>  
      ${orderItems} <!-- Insert the order items here -->
    </tbody>
    <tfoot>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px" colspan="3"><b>Sub-Total:</b></td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${cartSubTotal}
     </td>
      </tr>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px" colspan="3"><b>Discount:</b></td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${
    discount !== 0 ? 
    finalDiscount
     : "0"
  }</td>
      </tr>
          <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px" colspan="3"><b>${
          eligibleFreeShipping === false ? "Shipping charge" : "<span style='color:green;'>Free Shipping</span>"
        }:</b></td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${
          eligibleFreeShipping === false ? 
          shippingChargeFinal
      : "<span style='color:green;'>0</span>"
  }</td>
      </tr>
         <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px" colspan="3"><b>VAT(${
          vat?.rate || vat
        }%):</b></td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${vatAmount}
    
  </td>
      </tr>
      <tr>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px" colspan="3"><b>Total:</b></td>
        <td style="font-size:12px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;text-align:right;padding:7px">AED ${payAmount}
        </td>
      </tr>
    </tfoot>
  </table>
  
  <p style="margin-top:0px;margin-bottom:20px">Please reply to this e-mail if you have any questions.</p>
  <font color="#888888"></font>
  `;

  return item;
};



//WELCOME
export let WelcomeEmailTemplate = (content, name) => {
  const item = `<table role="presentation" style="width: 100%; background-color: #ffffff;">
        <tr>
            <td>
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff;  border-radius: 8px;">
                  <tr>
                        <td style="font-size: 16px; line-height: 1.6; color: #000; ">
                         <p style="margin:0;">${content}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="font-size: 16px; color: #000; margin-bottom:0;">Best regards,</p>
                            <p style="font-size: 16px; color: #000; margin-top:5px;">Team ${siteName}</p>
                         
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;

  return item;
};

//RETURN
export let ReturnEmailTemplate = (
  title,
  content,
  order_id,
  amount,
  opened,
  transition_id
) => {
  const item = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Field</th>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Details</th>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Title</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${title}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Content</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${content}</td>
  </tr>
    <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Opened</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${opened}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Order ID</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${order_id}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Amount</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${amount}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Transaction ID</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${transition_id}</td>
  </tr>
</table>`;

  return item;
};

//CANCELLATION
export let CancelEmailTemplate = (
  title,
  content,
  order_id,
  amount,
  transition_id
) => {
  const item = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Field</th>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Details</th>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Title</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${title}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Content</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${content}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Order ID</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${order_id}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Amount</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${amount}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Transaction ID</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${transition_id}</td>
  </tr>
</table>`;

  return item;
};

//CONTACT FORM

export let ContactEmailTemplate = (name, email, subject, message) => {
  const item = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Field</th>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Details</th>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Name</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${name}</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Email</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${email}</td>
  </tr>
      <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Message</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${subject}</td>
  </tr>
    <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Message</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${message}</td>
  </tr>
</table>`;

  return item;
};

//SUBSCRIBE FORM - ADMIN

export let SubscribeEmailTemplate = (email) => {
  const item = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Field</th>
    <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4; font-family: Arial, sans-serif;">Details</th>
  </tr>
 <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">Email</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-family: Arial, sans-serif;">${email}</td>
  </tr>
   
</table>`;

  return item;
};
