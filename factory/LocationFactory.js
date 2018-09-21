'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Location = require('../entity/Location');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class LocationFactory {
  static async makeLocation(putLocation) {
    const location = new Location(putLocation["beaconID"], putLocation["grid"],
                                  putLocation["place"], putLocation["time"]);

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const res = await db.collection('location').insert(location);
    client.close();
    return res.result;
  }
};
