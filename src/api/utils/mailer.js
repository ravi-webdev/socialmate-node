const sgMail = require('@sendgrid/mail');

const API_KEY = process.env.SENDGRID_KEY;

sgMail.setApiKey(API_KEY);

async function sendMail(options) {
  const html = `<div> Please click the following link to reset your password.
  <a href="https://www.mamaearth.in/reset-password/${options.id}/${options.hash}">
    Reset Password.
  </a> <br /> <br /> You can also manually paste https://www.mamaearth.in/reset-password/${options.id}/${options.hash} in your browser. </div>`;
  const msg = {
    to: options.email,
    from: {
      name: 'Team Mamaearth',
      email: 'hello@mamaearth.in',
    },
    subject: options.subject,
    text: options.message,
    html,
  };
  await sgMail.send(msg);
}

module.exports = sendMail;
