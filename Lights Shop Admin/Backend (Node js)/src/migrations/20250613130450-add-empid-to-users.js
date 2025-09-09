"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "empId", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true, // You can set to false if you're sure you'll populate this for all existing users
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "empId");
  },
};
