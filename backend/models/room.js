'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // Remova a função interna "Room.associate = function(models) {...}"
      Room.hasMany(models.Booking, {
        foreignKey: 'roomId',
        as: 'bookings'
      });
    }
  }
  Room.init({
    name: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    status: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE')
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
