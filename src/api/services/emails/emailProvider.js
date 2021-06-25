const Email = require('email-templates');
const { makeTransporter } = require('./makeTransporter');
const { emailConfig, siteTitle, siteUrl } = require('../../../config/vars');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = makeTransporter();

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log('error with email connection');
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.fromEmail || 'info@cureveda.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.userEmail,
        bcc: 'orders@cureveda.com',

      },
      locals: {
        productName: `${siteTitle}`,
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `${siteUrl}/reset-password/?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch((error) => console.log(error));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.fromEmail || 'info@cureveda.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: `${siteTitle}`,
        name: user.name,
      },
    })
    .catch(() => console.log('error sending change password email'));
};
