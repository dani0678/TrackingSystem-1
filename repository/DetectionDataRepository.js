'use strict';

//detecterからのデータなので基本的に削除, 変更はしない
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const DetectionData = require('../entity/DetectionData');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class DetectionDataRepository {
  static async addDetectionData(putDetectionData) {
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

  static async getDetectionData(searchBeaconID, searchTimes) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {detectedTime: {$lte: searchTimes["end"], $gte: searchTimes["start"]}};
    console.log(searchTimes);
    const detectionDataQuery = await db.collection('detectionData').find(searchQuery).toArray();
    console.log(detectionDataQuery);
    client.close();
    let detectionDatas = [];
    for(let query of detectionDataQuery) {
      const detectionData = new DetectionData(query["detectorNumber"], query["RSSI"],
                                              query["TxPower"], query["beaconID"],
                                              query["detectedTime"]);
      detectionDatas.push(detectionData);
    }
    return detectionDatas;
  }
};
