'use strict';
const ScheduleRepository = require('../Schedule/ScheduleRepository');
const fs = require('fs');

module.exports = class Schedule {
  static async check(tracker) {
    const schedules = await ScheduleRepository.getAllSchedule();
    const now = new Date();
    const moveableMapList = JSON.parse(fs.readFileSync('./moveableMapList.json', 'utf-8'));

    const checkSchedule = (schedule) => {
      if (tracker.Location.map !== schedule.room) {
        tracker.alert.schedule = true;
        return tracker.trackerName + 'さんが予定とは違う場所にいます';
      } else {
        tracker.alert.schedule = false;
        return '';
      }
    };

    for (let schedule of schedules) {
      const openingTime = new Date(schedule.openingTime);
      const closingTime = new Date(schedule.closingTime);
      const openingHour = openingTime.getHours();
      const closingHour = closingTime.getHours();
      const openingMinute = openingTime.getMinutes();
      const closingMinute = closingTime.getMinutes();
      if (schedule.trackerList.includes(tracker.trackerID)) {
        if (openingHour <= now.getHours() && now.getHours() <= closingHour) {
          if (openingHour === closingHour) {
            console.log('a');
            if (openingMinute <= now.getMinutes() && now.getMinutes() <= closingMinute) {
              if (tracker.Location.map !== schedule.room) {
                for (let map of moveableMapList['map']) {
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 5;
                  }
                }
                return tracker.trackerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          } else if (openingHour === now.getHours()) {
            console.log('b');
            console.log(tracker.alert.schedule);
            if (openingMinute <= now.getMinutes()) {
              if (tracker.Location.map !== schedule.room) {
                for (let map of moveableMapList['map']) {
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 5;
                  }
                }
                return tracker.trackerName + 'さんが予定とは違う場所にいます';
              } else {
                console.log('k1');
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              console.log('k2');
              tracker.alert.schedule = 0;
              continue;
            }
          } else if (closingHour === now.getHours()) {
            if (now.getMinutes() <= closingMinute) {
              if (tracker.Location.map !== schedule.room) {
                for (let map of moveableMapList['map']) {
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 5;
                  }
                }
                return tracker.trackerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          } else {
            console.log('d');
            console.log(tracker.alert.schedule);
            if (tracker.Location.map !== schedule.room) {
              for (let map of moveableMapList['map']) {
                if (map.mapID === tracker.Location.map) {
                  tracker.alert.schedule += 1;
                } else {
                  tracker.alert.schedule += 5;
                }
              }
              return tracker.trackerName + 'さんが予定とは違う場所にいます';
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          }
        } else {
          tracker.alert.schedule = 0;
          continue;
        }
      }
    }
  }
};
