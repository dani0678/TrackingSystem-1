'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Detector = require('../entity/Detector');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class DetectorFactory {
  static async makeDetector(detectorData) {
    const detector = new Detector(detectorData["detectorNumber"], detectorData["detectorGrid"],
                                  detectorData["detectorMap"]);

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const res = await db.collection('detector').insert(detector);
    client.close();
    return res.result;
  }
};
