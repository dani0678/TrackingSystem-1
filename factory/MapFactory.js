'use strict';

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Map = require('../entity/Map');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class MapFactory {
  static async makeMap(mapData) {
    const map = new Map(mapData["mapName"], mapData["keepOut"], mapData["mapSize"]);

    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const res = await db.collection('map').insert(map);
    client.close();
    return res.result;
  }
};
