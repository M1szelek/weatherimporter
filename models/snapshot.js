'use strict';
module.exports = (sequelize, DataTypes) => {
  const Snapshot = sequelize.define('Snapshot', {
    time: DataTypes.INTEGER,
    summary: DataTypes.STRING,
    icon: DataTypes.STRING,
    precipIntensity: DataTypes.FLOAT,
    precipProbability: DataTypes.FLOAT,
    temperature: DataTypes.FLOAT,
    apparentTemperature: DataTypes.FLOAT,
    dewPoint: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    pressure: DataTypes.FLOAT,
    windSpeed: DataTypes.FLOAT,
    windGust: DataTypes.FLOAT,
    windBearing: DataTypes.INTEGER,
    cloudCover: DataTypes.FLOAT,
    uvIndex: DataTypes.TINYINT,
    visibility: DataTypes.FLOAT,
    ozone: DataTypes.FLOAT
  }, {});
  Snapshot.associate = function(models) {
    // associations can be defined here
  };
  return Snapshot;
};