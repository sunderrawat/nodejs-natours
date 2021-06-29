const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //create transporter from ethereal.email
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.ethereal.email',
  //     port: 587,
  //     auth: {
  //       user: 'demetrius.stroman96@ethereal.email',
  //       pass: '2wrAzSWsE2MZ832Rpd',
  //     },
  //   });

  //define the email option
  const mailOptions = {
    from: 'Sunder Rawat <sunderrawat777@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };

  //actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
