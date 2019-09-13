"use strict";

const fs = require("fs");

module.exports = class Lost {
  constructor() {
    this.alertTime = 10000;
  }

  static check(tracker) {
    const date = new Date();
    if (tracker.Location) {
      if (this.abs(date.getTime() - tracker.Location.time) > this.alertTime) {
        tracker.alert.lost = true;
        return tracker.trackerName + "さんを見失いました！";
      } else {
        tracker.alert.lost = false;
        return "";
      }
    }
  }

  static abs(val) {
    return val < 0 ? -val : val;
  }
};