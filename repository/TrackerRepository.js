'use strict'

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Location = require('../entity/Location');
const Tracker = require('../entity/Tracker');
const TrackerFactory = require('../factory/TrackerFactory');
const LocationRepository = require('./LocationRepository');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class TrackerrRepository {
  static async addTracker(trackerData) {
    return await TrackerFactory.makeTracker(trackerData);
  }

  static async removeTracker(removedBeaconID) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const removeQuery = {beaconID: removedBeaconID};
    const res = await db.collection('tracker').remove(removeQuery);
    client.close();
    return res.result;
  }

  static async getAllTracker() {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const trackerQuery = await db.collection('tracker').find().toArray();
    client.close();
    let trackers = [];
    for(let query of trackerQuery) {
      const tracker = new Tracker(trackerData["trackerName"], trackerData["trackerID"],
                                  trackerData["beaconID"]);
      trackers.push(tracker);
    }
    return trackers;
  }

  static async getTrackerByBeaconID(searchedBeaconID, times) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {beaconID: searchedBeaconID};
    const trackerQuery = await db.collection('tracker').findOne(searchQuery);
    const tracker = new Tracker(trackerQuery["trackerName"], trackerQuery["trackerID"],
                                trackerQuery["beaconID"]);
    if(times) {
      const locations = await LocationRepository.getLocationByTime(tracker["beaconID"], times);
      tracker["Location"] = locations;
    }
    client.close();
    return tracker;
  }

  static async getTrackerByTrackerName(searchedTrackerName, times) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {trackerName: searchedTrackerName};
    const trackerQuery = await db.collection('tracker').find(searchQuery).toArray();
    client.close();
    let trackers = [];
    for(let query of trackerQuery) {
      const tracker = new Tracker(query["trackerName"], query["trackerID"],
                                  query["beaconID"]);
      if(times) {
        const locations = await LocationRepository.getLocationByTime(tracker["beaconID"], times);
      }
      trackers.push(tracker);
    }
    return trackers;
  }

  static async updateTracker(searchedBeaconID, setTrackerName) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {beaconID: searchedBeaconID};
    const newValueQuery = { $set: {trackerName: setTrackerName} };
    const res = await db.collection('tracker').updateOne(searchQuery, newValueQuery);
    client.close();
    return res.result;
  }
};
