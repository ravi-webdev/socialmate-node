
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { emailConfig } = require('../../../config/vars');

function makeSendgridOptions() {
  return emailConfig.sendgridApiKey
    ? {
      auth: {
        api_key: emailConfig.sendgridApiKey,
      },
    }
    : {
      auth: {
        api_user: emailConfig.sendgridUser,
        api_key: emailConfig.sendgridPassword,
      },
    };
}

exports.makeTransporter = function makeTransporter() {
  return nodemailer.createTransport(emailConfig.sendgridApiKey
    || (emailConfig.sendgridUser && emailConfig.sendgridPassword)
    ? sgTransport(makeSendgridOptions())
    : {
      port: emailConfig.port,
      host: emailConfig.host,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password,
      },
      secure: false,// upgrades later with STARTTLS -- change this based on the PORT
    });
};
