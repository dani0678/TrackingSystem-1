"use strict";

const uuidV4 = require("uuid/v4");

module.exports = class Tracker {
  constructor(trackerName, beaconID) {
    //Main User Status
    this.trackerName = trackerName;
    this.trackerID = uuidV4();
    this.beaconID = beaconID;

    //Alert Status
    this.alert = {lost: false, keepOut: false};
    this.notifyAddressList = [];
    this.mailTimeStamp = 0;
  }
};