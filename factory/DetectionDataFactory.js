'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const DetectionData = require('../entity/DetectionData');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class DetectionDataFactory {
  static async makeDetectionData(putDetectionData) {
    const detectionData = new DetectionData(putDetectionData["detectorNumber"],
                                            putDetectionData["rssi"],
                                            putDetectionData["measuredPower"],
                                            putDetectionData["beaconID"],
                                            putDetectionData["detectedTime"]);

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const res = await db.collection('detectionData').insert(detectionData);
    client.close();
    return res.result;
  }
};
