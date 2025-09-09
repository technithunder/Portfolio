'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'LED strips', createdAt: new Date(), updatedAt: new Date() },
      { name: 'LED hanging', createdAt: new Date(), updatedAt: new Date() },
      { name: 'CFL', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fairy Lights', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Curved LED', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Multicolor LED strip', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};

