/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customerId: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Customer.associate = function () {
    // associations can be defined here
  };
  return Customer;
};
