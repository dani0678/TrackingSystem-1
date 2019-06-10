'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Detector = require('./Detector');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class DetectorRepository {
  static async addDetector(detectorData) {
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

  static async removeDetector(searchedDetectorNumber) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const removeQuery = {detectorNumber: searchedDetectorNumber};
    const res = await db.collection('detector').remove(removeQuery);
    client.close();
    return res.result;
  }

  static async getDetector(searchedDetectorNumber) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    let detector;
    if(searchedDetectorNumber) {
      const searchQuery = {detectorNumber: searchedDetectorNumber};
      detector = await db.collection('detector').findOne(searchQuery);
    }else {
      detector = await db.collection('detector').find().toArray();;
    }
    client.close();
    return detector;
  }

  static async updateDetector(detectorData) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {detectorNumber: detectorData["detectorNumber"]};
    const newValueQuery = { $set: {detectorGrid: detectorData["detectorGrid"],
                                   detectorMap: detectorData["detectorMap"] }
                          };
    const res = await db.collection('detector').updateOne(searchQuery, newValueQuery);
    client.close();
    return res.result;
  }

  static async updateDetectorActiveLastTime(detectorData) {
    const date = new Date();
    const newDetectorActiveLastTime = date.getTime();

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {detectorNumber: detectorData["detectorNumber"]};
    const newValueQuery = { $set: { detectorActiveLastTime: newDetectorActiveLastTime } };
    const res = await db.collection('detector').updateOne(searchQuery, newValueQuery);
    client.close();
    return res.result;
  }
};
