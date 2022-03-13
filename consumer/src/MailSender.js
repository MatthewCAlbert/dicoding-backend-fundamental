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
  * @param {string} [data.html]
  * @param {any[]} [data.attachments]
  * @returns {any}
  *
  */
  sendEmail(targetEmail, data) {
    const {
      subject, text, html, attachments,
    } = data;
    const message = {
      from: {
        name: 'Notes App',
        address: process.env.MAIL_ADDRESS,
      },
      to: targetEmail,
      subject,
      text,
      html,
      attachments,
    };

    return this._transporter.sendMail(message);
  }

  sendEmailSampel(targetEmail, content) {
    const message = {
      from: 'Notes Apps',
      to: targetEmail,
      subject: 'Ekspor Catatan',
      text: 'Terlampir hasil dari ekspor catatan',
      attachments: [
        {
          filename: 'notes.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
