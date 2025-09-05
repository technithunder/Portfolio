'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisaType', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      label:{
        type:Sequelize.STRING,
        allowNull:false
      },
      value: {
        type: Sequelize.STRING,
        allowNull:false
      },
      deleteAt:{
        type: Sequelize.DATE,
        allowNull:true
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      },
      updatedAt :{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      }
    })
  },  

  async down(queryInterface, Sequelize) {
     await queryInterface.dropTable('VisaType');
  }
};
