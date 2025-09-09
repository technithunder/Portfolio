'use strict';

module.exports = {
  async up(queryInterface) {
    const data = [];
    const now = new Date();

    for (let i = 1; i <= 100; i++) {
      data.push({ value: i, createdAt: now, updatedAt: now });
    }

    await queryInterface.bulkInsert('Quantities', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Quantities', null, {});
  }
};
