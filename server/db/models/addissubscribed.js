/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const addisSubscribed = sequelize.define('addisSubscribed', {
    activeSubscription: DataTypes.BOOLEAN
  }, {});
  addisSubscribed.associate = function () {
    // associations can be defined here
  };
  return addisSubscribed;
};
