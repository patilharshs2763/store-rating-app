'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ratings', 'rating',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
        },

      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ratings', 'rating');
  }
};
