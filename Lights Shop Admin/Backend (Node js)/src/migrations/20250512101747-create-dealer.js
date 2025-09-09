'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    const nationalities = [
      { id: 1, label: "Afghan" },
      { id: 2, label: "Albanian" },
      { id: 3, label: "Algerian" },
      { id: 4, label: "American" },
      { id: 5, label: "Andorran" },
      { id: 6, label: "Angolan" },
      { id: 7, label: "Argentine" },
      { id: 8, label: "Armenian" },
      { id: 9, label: "Australian" },
      { id: 10, label: "Austrian" },
      { id: 11, label: "Azerbaijani" },
      { id: 12, label: "Bangladeshi" },
      { id: 13, label: "Belgian" },
      { id: 14, label: "Brazilian" },
      { id: 15, label: "British" },
      { id: 16, label: "Bulgarian" },
      { id: 17, label: "Canadian" },
      { id: 18, label: "Chilean" },
      { id: 19, label: "Chinese" },
      { id: 20, label: "Colombian" },
      { id: 21, label: "Croatian" },
      { id: 22, label: "Czech" },
      { id: 23, label: "Danish" },
      { id: 24, label: "Dutch" },
      { id: 25, label: "Egyptian" },
      { id: 26, label: "Estonian" },
      { id: 27, label: "Finnish" },
      { id: 28, label: "French" },
      { id: 29, label: "Georgian" },
      { id: 30, label: "German" },
      { id: 31, label: "Greek" },
      { id: 32, label: "Hungarian" },
      { id: 33, label: "Icelandic" },
      { id: 34, label: "Indian" },
      { id: 35, label: "Indonesian" },
      { id: 36, label: "Iranian" },
      { id: 37, label: "Iraqi" },
      { id: 38, label: "Irish" },
      { id: 39, label: "Israeli" },
      { id: 40, label: "Italian" },
      { id: 41, label: "Japanese" },
      { id: 42, label: "Jordanian" },
      { id: 43, label: "Kazakh" },
      { id: 44, label: "Kenyan" },
      { id: 45, label: "Korean" },
      { id: 46, label: "Kuwaiti" },
      { id: 47, label: "Latvian" },
      { id: 48, label: "Lebanese" },
      { id: 49, label: "Lithuanian" },
      { id: 50, label: "Malaysian" },
      { id: 51, label: "Mexican" },
      { id: 52, label: "Moroccan" },
      { id: 53, label: "Nepalese" },
      { id: 54, label: "New Zealander" },
      { id: 55, label: "Nigerian" },
      { id: 56, label: "Norwegian" },
      { id: 57, label: "Pakistani" },
      { id: 58, label: "Peruvian" },
      { id: 59, label: "Philippine" },
      { id: 60, label: "Polish" },
      { id: 61, label: "Portuguese" },
      { id: 62, label: "Qatari" },
      { id: 63, label: "Romanian" },
      { id: 64, label: "Russian" },
      { id: 65, label: "Saudi" },
      { id: 66, label: "Serbian" },
      { id: 67, label: "Singaporean" },
      { id: 68, label: "Slovak" },
      { id: 69, label: "Slovenian" },
      { id: 70, label: "South African" },
      { id: 71, label: "Spanish" },
      { id: 72, label: "Sri Lankan" },
      { id: 73, label: "Swedish" },
      { id: 74, label: "Swiss" },
      { id: 75, label: "Syrian" },
      { id: 76, label: "Taiwanese" },
      { id: 77, label: "Thai" },
      { id: 78, label: "Tunisian" },
      { id: 79, label: "Turkish" },
      { id: 80, label: "Ukrainian" },
      { id: 81, label: "Emirati" },
      { id: 82, label: "Venezuelan" },
      { id: 83, label: "Vietnamese" },
      { id: 84, label: "Yemeni" }
    ];

    const status= [
      { id: 1, label: "Active" },
      { id: 1, label: "In Active" },
      { id: 1, label: "Bloked" },
    ]

    await queryInterface.createTable('Dealers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      joiningDate: {
        type: Sequelize.DATEONLY
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.ENUM('male', 'female')
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      address: {
        type: Sequelize.STRING
      },
      nationality: {
        type: Sequelize.ENUM(...nationalities.map((n) => n.label))
      },
      status: {
        type: Sequelize.ENUM(...status.map((s) => s.label))
      },
      image: {
        type: Sequelize.STRING
      },
      maritalStatus: {
        type: Sequelize.ENUM('single', 'married')
      },
      degree: {
        type: Sequelize.STRING
      },
      university: {
        type: Sequelize.STRING
      },
      passingYear: {
        type: Sequelize.STRING
      },
      percentage: {
        type: Sequelize.FLOAT
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dealers');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dealers_gender";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dealers_maritalStatus";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dealers_nationality";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dealers_status";');
  }
};