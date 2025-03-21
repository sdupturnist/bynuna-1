// //https://dev.to/sheraz4194/sending-emails-in-nextjs-via-nodemailer-4ai2



// "use server";
// const nodemailer = require("nodemailer");
// const {
//   hostName,
//   portNumber,
//   emailUsername,
//   emailPassword,
//   siteEmail,
//   siteFromEmail,
//   siteName,
//   copyright,
//   siteLogoWhite,
// } = require("./variables");



// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: hostName,
//   port: portNumber,
//   //secure: true,
//   auth: {
//     user: emailUsername,
//     pass: emailPassword,
//   },
// });

// export async function sendMail({  sendTo, subject, message, name }) {
//   try {
//     const isVerified = await transporter.verify();
//   } catch (error) {
//     console.error("Something Went Wrong", emailUsername, emailPassword, error);
//     return;
//   }
//   const info = await transporter.sendMail({
//     from: siteFromEmail,
//     to: sendTo,
//     subject: subject,
//     html:
//       `




"use server";
const nodemailer = require("nodemailer");
const {
  hostName,
  portNumber,
  emailUsername,
  emailPassword,
  siteEmail,
  siteFromEmail,
  copyright,
  siteName,
  siteLogoWhite,
  secureStatus,
  tls,
} = require("./variables");

const transporter = nodemailer.createTransport({


  //   service: "gmail",
  // host: hostName,
  // port: portNumber,
  // //secure: true,
  // auth: {
  //   user: emailUsername,
  //   pass: emailPassword,
  // },

  host: hostName,
  port: portNumber,
  auth: {
    user: emailUsername,
    pass: emailPassword,
  },
  secure: secureStatus,
  requireTLS: tls,
  
  });
  
  
  
  export async function sendMail({ sendTo, subject, message, name }) {
    try {
      const isVerified = await transporter.verify();
    } catch (error) {
      console.error("Something Went Wrong", emailUsername, emailPassword, error);
      return;
    }
    try {

      
     const info = await transporter.sendMail({
      from: siteFromEmail,
      to: sendTo,
      subject: subject,
      html: `



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
        <table role="presentation" width="100%" cellspacing="0" cellPadding="0" style="border-collapse: collapse; background:#fff;">
            <!-- Header with Logo and Title -->
            <tr>
                <td style="background-color: #fff; border-bottom:solid thin #ddd; color: #fff; text-align: center; padding:  20px; font-size: 28px; font-weight: 600; position: relative;">
                    <!-- Logo Image (left aligned) -->
                    <img src="${siteLogoWhite}" alt="Logo" style="display:block; height: 40px;">
                 </td>
            </tr>

            <!-- Body Content -->
            <tr>
                <td style="padding: 20px; color: #15181E;">
                   <h2 style="font-size: 16px; color: #111;">Hi, ${name || ''}</h2>
                    <p style="font-size: 16px; line-height: 1.6; color:#666; padding-top:10px; padding-bottom:10px; border-bottom:solid thin #ddd; margin-bottom:20px;">${subject}</p>
                    <p style="font-size: 16px; line-height: 1.6; color:#666;">${message}</p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #15181E; color: #fff; text-align: center; padding: 15px; font-size: 14px;">
                    <p style="margin: 0;">${copyright}</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

        
    `,
  });

  console.log("Message sent: %s", info.messageId);
  return { success: true, messageId: info.messageId };
} catch (error) {
  console.error("Failed to send email:", error);
  return { success: false, message: error.message };
}
}