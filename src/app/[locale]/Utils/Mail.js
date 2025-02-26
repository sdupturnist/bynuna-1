//https://dev.to/sheraz4194/sending-emails-in-nextjs-via-nodemailer-4ai2

"use server";
const nodemailer = require("nodemailer");
const {
  hostName,
  portNumber,
  emailUsername,
  emailPassword,
  siteEmail,
  siteFromEmail,
  siteName,
  copyright,
  siteLogoWhite,
} = require("./variables");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: hostName,
  port: portNumber,
  //secure: true,
  auth: {
    user: emailUsername,
    pass: emailPassword,
  },
});

export async function sendMail({  sendTo, subject, message, name }) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error("Something Went Wrong", emailUsername, emailPassword, error);
    return;
  }
  const info = await transporter.sendMail({
    from: siteFromEmail,
    to: sendTo,
    subject: subject,
    html:
      `
   <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Enquiry Notification</title>
      <style>
         /* Import Inter font */
         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      </style>
   </head>
   <body style="font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff;">
         <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" style="border-collapse: collapse; background:#fff;">
            <!-- Header with Logo and Title -->
           <tr>
               <td style="background-color: #988643; color: #fff; text-align: center; padding: 20px 20px 10px 20px; font-size: 28px; font-weight: 600; position: relative; border-bottom:solid thin #eee;">
                  <p style="font-size: 24px; line-height: 1.6; color:#fff;">${subject}</p>
               </td>
            </tr>
            <tr>
               <td style="background-color: #fff; color: #fff; text-align: center; padding: 20px 20px 10px 20px; font-size: 28px; font-weight: 600; position: relative; border-bottom:solid thin #eee;">
                  <!-- Logo Image (left aligned) -->
                  <img src="${siteLogoWhite}" alt="Logo" style="display:block; height: 40px;">
               </td>
            </tr>
            <!-- Body Content -->
            <tr>
               <td style="padding: 20px; color: #15181E;">
                  <p style="font-size: 16px; margin:20px 0; color: #111;">Hi, ${name || ''}</p>
                  <p style="font-size: 16px; line-height: 1.6; color:#000;">${message}</p>
               </td>
            </tr>
            <!-- Footer -->
            <tr>
               <td style="background-color: #fff; border-top:solid thin #eee; color: #111; text-align: left; padding: 24px 15px; font-size: 14px;">
                  <p style="margin: 0;">${copyright}</p>
               </td>
            </tr>
         </table>
      </div>
   </body>
</html>

        
    `,
  });

  return info;
}
