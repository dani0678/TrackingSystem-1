'use strict';

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const Schedule = require('./Schedule');

const DBName = process.env.DB_NAME || 'tracking';
const DBURL = process.env.DB_URL + DBName || 'mongodb://localhost:27017/' + DBName;

module.exports = class ScheduleRepository {
  static async addSchedule(scheduleData) {
    const schedule = new Schedule(
      scheduleData['name'],
      scheduleData['openingTime'],
      scheduleData['closingTime'],
      scheduleData['room']
    );

    const client = await MongoClient.connect(DBURL).catch(err => {
      console.log(err);
    });
    const db = client.db(DBName);
    const res = await db.collection('schedule').insert(schedule);
    client.close();
    return res.result;
  }

  static async removeSchedule(scheduleID) {
    const client = await MongoClient.connect(DBURL).catch(err => {
      console.log(err);
    });
    const db = client.db(DBName);
    const removeQuery = { scheduleID: scheduleID };
    const res = await db.collection('schedule').remove(removeQuery);
    client.close();
  }

  static async getAllSchedule() {
    const client = await MongoClient.connect(DBURL).catch(err => {
      console.log(err);
    });
    const db = client.db(DBName);
    const scheduleQuery = await db
      .collection('schedule')
      .find()
      .toArray();
    client.close();
    let schedules = [];
    for (let schedule of scheduleQuery) {
      schedules.push(schedule);
    }
    return schedules;
  }

  static async getSchedule(scheduleID) {
    const client = await MongoClient.connect(DBURL).catch(err => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = { scheduleID: scheduleID };
    const schedule = await db.collection('schedule').findOne(searchQuery);
    client.close();
    return schedule;
  }

  static async updateTrackerList(scheduleID, trackerIDList) {
    const client = await MongoClient.connect(DBURL).catch(err => {
      console.log(err);
    });
    const db = client.db(DBName);
    const ID = scheduleID;
    const List = trackerIDList;

    const res = await db
      .collection('schedule')
      .update({ scheduleID: ID }, { $set: { trackerList: List } });
    client.close();
    return res.result;
  }
};
