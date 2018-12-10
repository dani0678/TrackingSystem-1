'use strict';

module.exports = class Tracker {
  constructor(trackerName, trackerID, beaconID) {
    //Main User Status
    this.trackerName = trackerName;
    this.trackerID = trackerID;
    this.beaconID = beaconID;

    //Alart Status
    this.alart = {lost: false, keepOut: false};
    this.notifyAddressList = [];
    this.mailTimeStamp = 0;
  }
};
