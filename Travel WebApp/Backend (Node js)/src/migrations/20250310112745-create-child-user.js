'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChildUsers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      parentUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      photo:{
        type:Sequelize.STRING,
        allowNull:true
      },
      passport:{
        type:Sequelize.JSONB,
        allowNull:true
      },
      extractedVisaDetails:{
        type:Sequelize.JSONB,
        allowNull:true
      },
      details:{
        type:Sequelize.JSONB,
        allowNull:true
      },
      step:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      visaId:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'VisaDetails',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChildUsers');
  },
};
