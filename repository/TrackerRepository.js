'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Tracker = require('../entity/Tracker');
const LocationRepository = require('./LocationRepository');
const MapRepository = require('./MapRepository');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class TrackerRepository {
  static async addTracker(trackerData) {
      const tracker = new Tracker(trackerData["trackerName"], trackerData["trackerID"],
          trackerData["beaconID"]);

      const client = await MongoClient.connect(DBURL)
          .catch((err) => {
              console.log(err);
          });
      const db = client.db(DBName);
      const res = await db.collection('tracker').insert(tracker);
      client.close();
      return res.result;
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
      const tracker = new Tracker(query["trackerName"], query["trackerID"], query["beaconID"]);
      tracker.Location = await LocationRepository.getLocationRecently(tracker.beaconID);
      if(Object.keys(tracker.Location).length > 0) {
          const map = await MapRepository.getMap(tracker.Location.place);
          if(map.keepOut) {
            tracker.Alart = true;
          }else{
            tracker.Alart = false;
          }
      }else{
        tracker.Alart = false;
      }

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
      tracker.Location = locations;
    }else {
      const locations = await LocationRepository.getLocationByBeaconIDOnly(tracker["beaconID"]);
      tracker.Location = locations;
    }
    client.close();
    return tracker;
  }

  static async getTrackerByTrackerID(searchedTrackerID, times) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {trackerID: searchedTrackerID};
    const trackerQuery = await db.collection('tracker').find(searchQuery).toArray();
    client.close();
    let trackers = [];
    for(let query of trackerQuery) {
      const tracker = new Tracker(query["trackerName"], query["trackerID"],
                                  query["beaconID"]);
      if(times == {}) {
        const locations = await LocationRepository.getLocationByTime(tracker["beaconID"], times);
        tracker.Location = locations;
      }else{
        const locations = await LocationRepository.getLocationByBeaconIDOnly(tracker["beaconID"]);
        tracker.Location = locations;
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
