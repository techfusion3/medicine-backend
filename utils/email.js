// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Not Loaded');



// const nodemailer = require('nodemailer');

// // Create a transporter using the Gmail service and your credentials
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,   
//     pass: process.env.EMAIL_PASS,  
//   },
// });

// // Function to send an email
// const sendReminderEmail = async (to, subject, text, html) => {


//     console.log('📧 Trying to send to:', to);

//     if (!to) {
//         console.warn('❗ Skipping email: No recipient defined');
//         return;
//       }
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//         console.warn('❗ Email credentials not set properly.');
//         return;
//       }

//   const mailOptions = {
//     from: process.env.EMAIL_USER,   
//     to: to,                         // The recipient's email address (can be passed when calling the function)
//     subject: subject,               // The subject of the email
//     text: text,                     // The body of the email (message)
//     html: html,                     // For styling content in email
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//   } catch (err) {
//     console.error('Error sending email:', err);
//   }
// };

// module.exports = sendReminderEmail;

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendReminderEmail = async (to, subject, text, html) => {
  console.log('📧 Trying to send to:', to);

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: text || '',
        },
        Html: {
          Charset: 'UTF-8',
          Data: html || `<p>${text}</p><p><a href="${unsubscribeLink}">Unsubscribe</a></p>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject || 'No Subject',
      },
    },
    Source: process.env.EMAIL_USER,
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('✅ Email sent:', data);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
};

module.exports = sendReminderEmail;

