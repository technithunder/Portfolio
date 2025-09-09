module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "averageRating", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "averageRating");
  },
};