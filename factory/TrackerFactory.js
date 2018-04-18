'use strict'

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Tracker = require('../entity/Tracker');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class TrackerFactory {
  static async makeTracker(trackerData) {
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
};
