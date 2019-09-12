/* eslint-disable default-case */
/* eslint-disable class-methods-use-this */
import Pusher from 'pusher';
import { config } from 'dotenv';
import models from '../db/models';
import helpers from '.';

config();
const { Mail } = helpers;

/**
 * @Module Notification
 * @description Controlls all activities related to Articles
 */
class Notification {
  /**
   * @description send notifications to the specified user(s)
   * @param {Array} userArray - An array of users to notify
   * @param {Object} payload - information related to the notification
   * @returns {Object} returns articles base on the pagination params
   * @memberof Notification
   */
  static async notify(userArray, payload) {
    const users = userArray.map(user => user.dataValues);
    const mailingList = users.filter(user => user.newPostEmailSub);
    this.inAppNotify(
      users,
      payload.resourceType,
      payload.resourceId,
      payload.message
    );
    this.pushNotify(
      users,
      payload.resourceType,
      payload.resourceId,
      payload.message
    );
    this.emailNotify(mailingList, payload);
  }

  /**
   * @description send in-app notifications to the specified user(s)
   * @param {Array} users - An array of users to notify
   * @param {String} type - the type of the notification
   * @param {String} id - the id of the resource
   * @param {String} message - the notification message to send
   * @returns {null} null
   * @memberof Notification
   */
  static async inAppNotify(users, type, id, message) {
    users.forEach(async (user) => {
      const personalizedMessage = `Hey ${user.username}, ${message}`;
      await models.Notification.create({
        userId: user.id,
        resourceType: type,
        resourceId: id,
        message: personalizedMessage,
        read: false,
      });
    });
  }

  /**
   * @description send push notifications to the specified user(s)
   * @param {Array} users - An array of users to notify
   * @param {String} type - the type of the notification
   * @param {String} id - the id of the resource
   * @param {String} message - the notification message to send
   * @returns {null} null
   * @memberof Notification
   */
  static async pushNotify(users, type, id, message) {
    const pushNotification = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
      useTLS: true
    });
    users.forEach(async (user) => {
      const personalizedMessage = `Hey ${user.username}, ${message}`;
      pushNotification.trigger('push-notifications', `notify-${user.username}`, {
        resourceType: type,
        resourceId: id,
        message: personalizedMessage,
      });
    });
  }

  /**
   * @description send email notifications to subscribed user(s)
   * @param {Array} mailingList - An array of users to notify
   * @param {Object} payload - information related to the notification
   * @returns {null} null
   * @memberof Notification
   */
  static async emailNotify(mailingList, payload) {
    let data = {};
    switch (payload.resourceType) {
      case 'article':
        data = {
          subject: 'New post alert',
          header: 'New post from an author you follow',
          messageBody: `${payload.message}. Click the link below to view the article`,
          text: 'Read Article',
        };
        break;
      case 'comment':
        data = {
          subject: 'New comment alert',
          header: 'New comment on your article',
          messageBody: `${payload.message}. Click the link below to view the comment`,
          text: 'View Comment',
        };
        break;
      case 'follow':
        data = {
          subject: 'New Follow alert',
          header: 'Someone just followed you',
          messageBody: `${payload.message}. Click the link below to view the user`,
          text: 'View User',
        };
        break;
    }
    mailingList.forEach((user) => {
      const mail = new Mail({
        to: user.email,
        subject: data.subject,
        header: data.header,
        messageHeader: `Hi, ${user.username}!`,
        messageBody: data.messageBody,
        iButton: true
      });
      mail.InitButton({
        text: data.text,
        link: `${process.env.APP_URL}/api/v1/articles/${payload.resourceId}`,
      });
      mail.sendMail();
    });
  }
}

export default Notification;
