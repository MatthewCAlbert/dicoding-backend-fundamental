const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  /**
  * Send email
  * @param {string} targetEmail
  * @param {object} data
  * @param {string} data.subject
  * @param {string} [data.text]
  * @param {any[]} [data.attachments]
  * @returns {any}
  *
  */
  sendEmail(targetEmail, data) {
    const {
      subject, text, attachments,
    } = data;
    const message = {
      from: {
        name: 'OpenMusic App',
        address: process.env.MAIL_ADDRESS,
      },
      to: targetEmail,
      subject,
      text,
      attachments,
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
