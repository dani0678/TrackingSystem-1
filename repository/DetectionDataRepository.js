'use strict'
//detecterからのデータなので基本的に削除, 変更はしない
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const DetectionData = require('../entity/DetectionData');
const DetectionDataFactory = require('../factory/DetectionDataFactory');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class DetectionDataRepository {
  static async addDetectionData(putDetectionData) {
    return await DetectionDataFactory.makeDetectionData(putDetectionData);
  }

  static async getDetectionData(searchBeaconID, searchTimes) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {$and: [{detectedTime: {$lte: searchTimes["end"],
                                        $gte: searchTimes["start"] }},
                                {beaconID: searchBeaconID }]
    };
    const detectionDataQuery = await db.collection('detectionData').find(searchQuery).toArray();
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
