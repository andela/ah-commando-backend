/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Subscriptions = sequelize.define('Subscriptions', {
    subscriptionId: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Subscriptions.associate = function () {
    // associations can be defined here
  };
  return Subscriptions;
};
