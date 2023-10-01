'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.associate = function(models) {
        Booking.belongsTo(models.Room, {
            foreignKey: 'roomId',
            onDelete: 'CASCADE'
        });
        Booking.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
     };
    }
  }
  Booking.init({
    roomId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startBooking: DataTypes.DATE,
    endBooking: DataTypes.DATE,
    status: DataTypes.ENUM('REQUESTED', 'APPROVED', 'REJECTED')
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};