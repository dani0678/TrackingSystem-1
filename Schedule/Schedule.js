'use strict';

const uuidV4 = require('uuid/v4');

module.exports = class Schedule {
  constructor(name, openingTime, closingTime, room) {
    this.name = name;
    this.openingTime = openingTime;
    this.closingTime = closingTime;
    this.room = room;
    this.trackerList = [];
    this.scheduleID = uuidV4();
  }
};
