import sendgridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import debug from 'debug';
import style from './style';

dotenv.config();

const log = debug('dev');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
const senderEmail = process.env.SERVER_MAIL;

<<<<<<< HEAD
/* istanbul ignore next */
=======
>>>>>>> feat(Email): Recieve verification notification
/**
  * @Module Mailer
  * @description Controlls all the mail based activities
  */
class Mailer {
  /**
    * Malier class constructor
    * @param {Object} mailObject - the mailer Object
    * @param {String} mailObject.to - the user the email should go to
    * @param {String} mailObject.message - the message to be sent to the user
    * @param {Boolean} mailObject.iButton - to add a button
    * @param {Boolean} mailObject.template - to add additional user templates
    * @static
    */
  constructor(mailObject) {
    const {
<<<<<<< HEAD
      to, subject, header, messageBody, messageHeader, iButton, iTemplate
    } = mailObject;
    this.to = to;
    this.messageBody = messageBody || null;
    this.messageHeader = messageHeader || null;
=======
      to, subject, header, message, iButton, iTemplate
    } = mailObject;
    this.to = to;
    this.message = message || null;
>>>>>>> feat(Email): Recieve verification notification
    this.iButton = iButton || false;
    this.iTemplate = iTemplate || false;
    this.subject = subject;
    this.header = 'Welcome to Authors Haven' || header;
    this.buttonTemp = '';
    this.bodyStyle = '';
    this.headerStyle = '';
    this.messageStyle = '';
    this.templateTemp = '';
  }

  /**
   * Email trasporter
   * @param {String} to - Reciever email
   * @param {String} from - Sender email
   * @param {String} subject - Email subject
   * @param {String} html - Email body
   * @returns  {Object} - Mailer response
   */
  async sendMail() {
<<<<<<< HEAD
    if (!this.messageBody) { throw new Error('Message cannot be empty!'); }
=======
    if (!this.message) { throw new Error('Message cannot be empty!'); }
>>>>>>> feat(Email): Recieve verification notification
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
<<<<<<< HEAD
=======
          <link href="https://fonts.googleapis.com/css?family=Montserrat:200,500,700" rel="stylesheet">
>>>>>>> feat(Email): Recieve verification notification
          <style>
            ${style}
          </style>
        </head>
        <body>
          <div class='container' style = ${this.bodyStyle}>
            <div class='mail-message'>
              <h2 style = ${this.headerStyle}>${this.header}</h2>
<<<<<<< HEAD
              <p style = ${this.messageStyle}>${this.messageHeader}</p>
              <p style = ${this.messageStyle}>${this.messageBody} </p>
=======
              <p style = ${this.messageStyle}>${this.message}</p>
>>>>>>> feat(Email): Recieve verification notification
              ${this.iButton ? this.buttonTemp : ''}
              ${this.iTemplate ? this.templateTemp : ''}
            </div>
          </div>
        </body>
      </html>
  `;

    const mail = {
      to: this.to,
      from: senderEmail,
      subject: this.subject,
      html
    };

    try {
      await sendgridMail.send(mail);
      log(`Message Sent! to ${mail.to}`);
    } catch (err) { log(err.message); }
  }

  /**
   * Sets the email Header
   * @param {String} header - The header of the mail
   * @returns {null} - dosen't return an object
   */
  setHeader(header) {
    this.header = header;
  }

  /**
   * Intializes the button
   * @param {Object} styles - the ButtonObject
   * @param {text} button.bodyStyle - The new subject of the mail
   * @param {link} button.subjectStyle - The new subject of the mail
   * @param {linkStyle} button.messageStyle - The new subject of the mail
   * @returns {null} - dosen't return an object
   */
  setStyles(styles) {
    const { bodyStyle, headerStyle, messageStyle } = styles;
    this.bodyStyle = bodyStyle || this.bodyStyle;
<<<<<<< HEAD
    this.subjectStyle = headerStyle || this.subjectStyle;
=======
    this.subjectStyle = headerStyle || this.headerStyle;
>>>>>>> feat(Email): Recieve verification notification
    this.messageStyle = messageStyle || this.messageStyle;
  }

  /**
   * Intializes the button
   * @param {Object} button - the ButtonObject
   * @param {text} button.text - The new subject of the mail
   * @param {link} button.link - The new subject of the mail
   * @param {linkStyle} button.linkStyle - The new subject of the mail
   * @param {textStyle} button.textStyle - The new subject of the mail
   * @param {textStyle} button.textStyle - The new subject of the mail
   * @returns {null} - dosen't return an object
   */
  InitButton(button) {
    const {
      text, link, linkStyle, buttonStyle
    } = button;
    const bStyle = buttonStyle || '';
    const lStyle = linkStyle || '';

    this.buttonTemp = `
      <div class='button' style = '${bStyle}'>
<<<<<<< HEAD
        <a style = 'color: rgb(255, 199, 0); ${lStyle}' class='link' href = '${link}'>${text}</a>
=======
        <a style = 'color: white; ${lStyle}' class='link' href = '${link}'>${text}</a>
>>>>>>> feat(Email): Recieve verification notification
      </div>
    `;
  }

  /**
   * Sets the user defined Templates
   * @param {Object} Temp - user defined Template Object
   * @returns {null} - dosen't return an object
   */
  Initemplate(Temp) {
    this.templateTemp = Temp;
  }
}

export default Mailer;
