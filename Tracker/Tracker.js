'use strict';

module.exports = class Tracker {
  constructor(trackerName, trackerID, beaconID) {
    this.trackerName = trackerName;
    this.trackerID = trackerID;
    this.beaconID = beaconID;
  }
};
