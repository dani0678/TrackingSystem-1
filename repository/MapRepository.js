'use strict'

const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Map = require('../entity/Map');
const MapFactory = require('../factory/MapFactory');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const DBName = config.DB.Name;
const DBURL = config.DB.URL + '/' + DBName;

module.exports = class MapRepository {
  static async addMap(mapData) {
    return await MapFactory.makeMap(mapData);
  }

  static async removeMap(searchedMapName) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const removeQuery = {mapName: searchedMapName};
    const res = await db.collection('map').remove(removeQuery);
    client.close();
  }

  static async getMap(searchedMapName) {
    const client = await MongoClient.connect(DBURL)
    .catch((err) => {
      console.log(err);
    });
    const db = client.db(DBName);
    const searchQuery = {mapName: searchedMapName};
    const mapQuery = await db.collection('map').findOne(searchQuery);
    const map = new Map(mapQuery["mapName"], mapQuery["keepOut"]);
    client.close();
    return map;
  }
};
