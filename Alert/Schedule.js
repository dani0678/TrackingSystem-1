'use strict';
const ScheduleRepository = require('../Schedule/ScheduleRepository');

module.exports = class Schedule {
  static async check(tracker) {
    const schedules = await ScheduleRepository.getAllSchedule();
    const now = new Date();

    const checkSchedule = schedule => {
      if (tracker.Location.map !== schedule.room) {
        tracker.alert.schedule = true;
        return tracker.tarckerName + 'さんが予定とは違う場所にいます';
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
            if (openingMinute <= now.getMinutes() && now.getMinutes() <= closingMinute) {
              if (tracker.Location.map !== schedule.room) {
                tracker.alert.schedule = true;
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = false;
                continue;
              }
            } else {
              tracker.alert.schedule = false;
              continue;
            }
          } else if (openingHour === now.getHours()) {
            if (openingMinute <= now.getMinutes()) {
              if (tracker.Location.map !== schedule.room) {
                tracker.alert.schedule = true;
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = false;
                continue;
              }
            } else {
              tracker.alert.schedule = false;
              continue;
            }
          } else if (closingHour === now.getHours()) {
            if (now.getMinutes() <= closingMinute) {
              if (tracker.Location.map !== schedule.room) {
                tracker.alert.schedule = true;
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = false;
                continue;
              }
            } else {
              tracker.alert.schedule = false;
              continue;
            }
          } else {
            if (tracker.Location.map !== schedule.room) {
              tracker.alert.schedule = true;
              return tracker.tarckerName + 'さんが予定とは違う場所にいます';
            } else {
              tracker.alert.schedule = false;
              continue;
            }
          }
        } else {
          tracker.alert.schedule = false;
          continue;
        }
      }
    }
  }
};
