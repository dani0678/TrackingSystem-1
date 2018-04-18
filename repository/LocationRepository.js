'use strict'
//detecterからのデータなので基本的に削除, 変更はしない
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Location = require('../entity/Location');
const LocationFactory = require('../factory/LocationFactory');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class LocationRepository {
  static async addLocation(putLocation) {
    return await LocationFactory.makeLocation(putLocation);
  }

  static async getLocationByTime(searchBeaconID, searchTimes) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {$and: [{time: {$lte: searchTimes["end"],
                                        $gte: searchTimes["start"] }},
                                {beaconID: searchBeaconID }]
                        };
    const locationQuery = await db.collection('location').find(searchQuery).toArray();
    client.close();
    let locations = [];
    for(let query of locationQuery) {
      const location = new Location(query["beaconID"], query["grid"],
                                    query["place"], query["time"]);
      locations.push(location);
    }
    return locations;
  }

  static async getLocationByBeaconIDOnly(searchBeaconID) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = { beaconID: searchBeaconID };
    const locationQuery = await db.collection('location').find(searchQuery).toArray();
    client.close();
    let locations = [];
    for(let query of locationQuery) {
      const location = new Location(query["beaconID"], query["grid"],
                                    query["place"], query["time"]);
      locations.push(location);
    }
    return locations;
  }
};
