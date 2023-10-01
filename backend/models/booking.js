'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Remova a função interna "Booking.associate = function(models) {...}"
      Booking.belongsTo(models.Room, {
        foreignKey: 'roomId',
        onDelete: 'CASCADE',
        as: 'room'
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
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
