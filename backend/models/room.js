'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.associate = function(models) {
        Room.hasMany(models.Booking, {
            foreignKey: 'roomId',
            as: 'bookings'
        });
      };
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