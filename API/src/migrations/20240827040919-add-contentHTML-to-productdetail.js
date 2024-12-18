"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Productdetails", "contentHTML", {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Productdetails", "contentHTML");
  },
};
