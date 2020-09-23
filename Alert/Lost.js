'use strict';
const fs = require('fs');

module.exports = class Lost {
  static check(tracker) {
    const alertTime = 15000;
    const date = new Date();
    const lostMapList = JSON.parse(fs.readFileSync('./lostMapList.json', 'utf-8'));
    if (tracker.Location) {
      if (this.abs(date.getTime() - tracker.Location.locatedTime) > alertTime) {
        for (let map of lostMapList['map']) {
          if (map.mapID === tracker.Location.map) {
            tracker.alert.lost = true;
            return tracker.trackerName + 'さんを見失いました！';
          }
        }
      } else {
        tracker.alert.lost = false;
        return '';
      }
    }
  }

  static abs(val) {
    return val < 0 ? -val : val;
  }
};
