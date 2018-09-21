'use strict';

module.exports = class Location {
  constructor(beaconID, grid, place, time){
    this.beaconID = beaconID;
    this.grid = grid;
    this.place = place;
    this.time = time;
  }
};
