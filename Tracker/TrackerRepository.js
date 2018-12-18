'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Tracker = require('./Tracker');
const LocationRepository = require('../location/LocationRepository');
const MapRepository = require('../map/MapRepository');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class TrackerRepository {
  static async addTracker(trackerData) {
      const tracker = new Tracker(trackerData["trackerName"], trackerData["beaconID"]);

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
      const tracker = new Tracker(query["trackerName"], query["trackerID"], query["beaconID"],
                                  query["Alart"], query["notifyAddressList"], query["mailTimeStamp"]);
      tracker.Location = await LocationRepository.getLocationRecently(tracker.beaconID);
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
    const tracker = new Tracker(query["trackerName"], query["trackerID"], query["beaconID"],
                                query["Alart"], query["notifyAddressList"], query["mailTimeStamp"]);
    if(times) {
      const locations = await LocationRepository.getLocationByTime(tracker.beaconID, times);
      tracker.Location = locations;
    }else {
      const locations = await LocationRepository.getLocationByBeaconIDOnly(tracker.beaconID);
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
    const trackerQuery = await db.collection('tracker').findOne(searchQuery);
    client.close();
    const tracker = new Tracker(query["trackerName"], query["trackerID"], query["beaconID"],
                                query["Alart"], query["notifyAddressList"], query["mailTimeStamp"]);
    if(times) {
      const locations = await LocationRepository.getLocationByTime(tracker.beaconID, times);
      tracker.Location = locations;
    }else {
      const locations = await LocationRepository.getLocationByBeaconIDOnly(tracker.beaconID);
      tracker.Location = locations;
    }
    client.close();
    return tracker;
  }

  static async updateTracker(searchedTrackerID, newValueQuery) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {beaconID: searchedTrackerID};
    const res = await db.collection('tracker').updateOne(searchQuery, newValueQuery);
    client.close();
    return res.result;
  }

  static async addTrackerMailAddr(searchedTrackerID, newAddr) {
    const tracker = this.getTrackerByTrackerID(searchedTrackerID);
    const newAddrList = tracker.notifyAddressList.push(newAddr);

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {beaconID: searchedTrackerID};
    const newValueQuery = { $set: {notifyAddressList: newAddrList} };
    const res = await db.collection('tracker').updateOne(searchQuery, newValueQuery);
    client.close();
    return res.result;
  }
};
