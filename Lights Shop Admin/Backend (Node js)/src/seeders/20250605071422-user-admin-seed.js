"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "admin@gmail.com",
          Password: hashedPassword,
          role: "admin",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@gmail.com" }, {});
  },
};
