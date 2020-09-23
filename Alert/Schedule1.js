const ScheduleRepository = require('../Schedule/ScheduleRepository');

module.exports = class Schedule {
  static async check(tracker) {
    const schedules = await ScheduleRepository.getAllSchedule();
    const now = new Date();
    const moveableMapList = JSON.parse(fs.readFileSync('./moveableMapList.json', 'utf-8'));

    const checkSchedule = (schedule) => {
      if (tracker.Location.map !== schedule.room) {
        for (let map of moveableMapList['map']) {
          console.log(taracker.alert.schedule);
          if (map.mapID === tracker.Location.map) {
            tracker.alert.schedule += 1;
          } else {
            tracker.alert.schedule += 100;
          }
        }
        return tracker.trackerName + 'さんが予定とは違う場所にいます';
      } else {
        tracker.alert.schedule = 0;
        continue;
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
                for (let map of moveableMapList['map']) {
                  console.log(taracker.alert.schedule);
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 100;
                  }
                }
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          } else if (openingHour === now.getHours()) {
            if (openingMinute <= now.getMinutes()) {
              if (tracker.Location.map !== schedule.room) {
                for (let map of moveableMapList['map']) {
                  console.log(taracker.alert.schedule);
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 100;
                  }
                }
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          } else if (closingHour === now.getHours()) {
            if (now.getMinutes() <= closingMinute) {
              if (tracker.Location.map !== schedule.room) {
                for (let map of moveableMapList['map']) {
                  console.log(taracker.alert.schedule);
                  if (map.mapID === tracker.Location.map) {
                    tracker.alert.schedule += 1;
                  } else {
                    tracker.alert.schedule += 100;
                  }
                }
                return tracker.tarckerName + 'さんが予定とは違う場所にいます';
              } else {
                tracker.alert.schedule = 0;
                continue;
              }
            } else {
              tracker.alert.schedule = 0;
              continue;
            }
          } else {
            if (tracker.Location.map !== schedule.room) {
              for (let map of moveableMapList['map']) {
                console.log(taracker.alert.schedule);
                if (map.mapID === tracker.Location.map) {
                  tracker.alert.schedule += 1;
                } else {
                  tracker.alert.schedule += 100;
                }
              }
              return tracker.tarckerName + 'さんが予定とは違う場所にいます';
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
