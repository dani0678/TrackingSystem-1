'use strict';

const fs = require('fs');
const _ = require('underscore');
const MapRepository = require('../Map/MapRepository');

module.exports = class KeepOut {
  static async check(tracker) {
    const keepOutList = JSON.parse(fs.readFileSync('./keepOutMapList.json', 'utf-8'));
    const allMaps = await MapRepository.getAllMap();
    console.log(allMaps);
    let trackerLocation = allMaps.find((map) => map.mapID === tracker.Location.map);

    const includedMeta = (map) => {
      if (trackerLocation) {
        return map.meta === trackerLocation.mName;
      }
    };
    const includedPlace = (map) => {
      if (trackerLocation) {
        return map.name === trackerLocation.name;
      }
    };
    const includedMetaPlace = (map) => {
      if (trackerLocation) {
        return map.meta === trackerLocation.mName && map.name == trackerLocation.name;
      }
    };
    const addKeepOutValue = (map) => {
      if (map.shape === 'vertical') {
        if (map.entrance === 'top') {
          tracker.alert.keepOut +=
            (tracker.Location.grid.y - trackerLocation.size[0].min.y) /
            (trackerLocation.size[0].max.y - trackerLocation.size[0].min.y);
        } else if (map.entrance === 'bottom') {
          tracker.alert.keepOut +=
            (trackerLocation.size[0].max.y - tracker.Location.grid.y) /
            (trackerLocation.size[0].max.y - trackerLocation.size[0].min.y);
        }
      } else if (map.shape === 'horizontal') {
        if (map.entrance === 'right') {
          tracker.alert.keepOut +=
            (trackerLocation.size[0].max.x - tracker.Location.grid.x) /
            (trackerLocation.size[0].max.x - trackerLocation.size[0].min.x);
        } else if (map.entrance === 'left') {
          tracker.alert.keepOut +=
            (tracker.Location.grid.x - trackerLocation.size[0].min.x) /
            (trackerLocation.size[0].max.x - trackerLocation.size[0].min.x);
        }
      }
    };
    let keepout = false;
    for (let map of keepOutList['map']) {
      if (tracker.Location) {
        switch (true) {
          case map.hasOwnProperty('meta') && map.hasOwnProperty('name'):
            if (includedMetaPlace(map) && _.indexOf(map.IDList, tracker.trackerID) != -1) {
              addKeepOutValue(map);
              keepout = true;
              return (
                tracker.trackerName + 'さんが' + map.meta + 'の' + map.name + 'に侵入しています！'
              );
            }
            break;
          case !map.hasOwnProperty('name'):
            if (includedMeta(map) && _.indexOf(map.IDList, tracker.trackerID) != -1) {
              addKeepOutValue(map);
              keepout = true;
              return tracker.trackerName + 'さんが' + map.meta + 'に侵入しています！';
            }
            break;
          case !map.hasOwnProperty('meta'):
            if (includedPlace(map) && _.indexOf(map.IDList, tracker.trackerID) != -1) {
              addKeepOutValue(map);
              keepout = true;
              return tracker.trackerName + 'さんが' + map.name + 'に侵入しています！';
            }
            break;
        }
        if (!keepout) {
          tracker.alert.keepOut = 0;
          return '';
        }
      }
    }
  }

  static abs(val) {
    return val < 0 ? -val : val;
  }
};
