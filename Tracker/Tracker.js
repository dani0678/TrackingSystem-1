'use strict';

const uuidV4 = require('uuid/v4');
const Identicon = require('identicon.js');

module.exports = class Tracker {
  constructor(trackerName, beaconID, userStatus = 'Tenant') {
    //Main User Status
    this.trackerName = trackerName;
    this.trackerID = uuidV4();
    this.beaconID = beaconID;
    this.userStatus = userStatus;
    this.userImage = new Identicon(this.trackerID.replace(/-/g, ''), 32).toString();

    //Alert Status
    this.alert = { lost: false, keepOut: 0, schedule: 0 };
    this.keepOutMaps = [];
    this.notifyAddressList = [];
    this.mailTimeStamp = 0;
  }
};
