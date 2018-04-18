'use strict'

const MapRepository = require('../repository/MapRepository');

const testData1 = {
        "mapName": "testMap",
        "maxGrid": {
          "x": 100,
          "y": 100
        },
        "minGrid": {
          "x": 0,
          "y": 0
        },
};

const testData2 = {
        "mapName": "testMap2",
        "maxGrid": {
          "x": 100,
          "y": 100
        },
        "minGrid": {
          "x": 0,
          "y": 0
        },
};

//順番を守るがためのネスト地獄ゆえ許せ
MapRepository.addMap(testData1).then((res) => {
  console.log(res);

  MapRepository.addMap(testData2).then((res) => {
    console.log(res);

    MapRepository.getMap("testMap").then((res) => {
      console.log(res);

      MapRepository.removeMap("testMap").then(() => {　
        console.log(res);
      });
    });
  });
});
