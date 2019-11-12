'use strict';

const ScheduleRepository = require('../Schedule/ScheduleRepository');

module.exports = class Handler {
  static addSchedule(req, res) {
    const schedule = req.body;
    ScheduleRepository.addSchedule(schedule).then(() => {
      res.send('Schedule Add Success!');
    });
  }

  static deleteSchedule(req, res) {
    const scheduleId = req.params.id;
    ScheduleRepository.removeSchedule(scheduleId).then(() => {
      res.send('Successfully delete schedule!');
    });
  }

  static getSchedule(req, res) {
    ScheduleRepository.getAllSchedule().then(schedule => {
      res.send(schedule);
    });
  }

  static selectSchedule(req, res) {
    const scheduleId = req.params.id;
    ScheduleRepository.getSchedule(scheduleId).then(schedule => {
      res.send(schedule);
    });
  }

  static updateTrackerList(req, res) {
    const scheduleID = req.params.id;
    const trackerID = req.body;
    ScheduleRepository.updateSchedule(scheduleID, trackerID).then(() => {
      res.send('Successfully put schedule!');
    });
  }
};
