'use strict';

//detecterからのデータなので基本的に削除, 変更はしない
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Location = require('./Location');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class LocationRepository {
  static async addLocation(putLocation) {
      const location = new Location(putLocation["beaconID"], putLocation["grid"],
          putLocation["map"], putLocation["time"]);

      const client = await MongoClient.connect(DBURL)
          .catch((err) => {
              console.log(err);
          });
      const db = client.db(DBName);
      const res = await db.collection('location').insert(location);
      client.close();
      return res.result;
  }

  static async getLocationByTime(searchBeaconID, searchTimes) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {$and: [{locatedTime: {$lte: searchTimes["end"],
                                        $gte: searchTimes["start"] }},
                                {beaconID: searchBeaconID }]
                        };
    const locationQuery = await db.collection('location').find(searchQuery).toArray();
    client.close();
    let locations = [];
    for(let query of locationQuery) {
      const location = new Location(query["beaconID"], query["grid"],
                                    query["map"], query["locatedTime"]);
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
                                    query["map"], query["locatedTime"]);
      locations.push(location);
    }
    return locations;
  }

    static async getLocationRecently(searchBeaconID) {
        const client = await MongoClient.connect(DBURL)
            .catch((err) => {
                console.log(err);
            });
        const db = client.db(DBName);
        const searchQuery = { beaconID: searchBeaconID };
        const locationQuery = await db.collection('location').find(searchQuery).sort({time: -1}).toArray();
        client.close();
        let location = {};
        if(locationQuery.length > 0) {
            location = new Location(locationQuery[0]["beaconID"], locationQuery[0]["grid"],
                                    locationQuery[0]["map"], locationQuery[0]["locatedTime"]);
        }
        return location;
    }
};