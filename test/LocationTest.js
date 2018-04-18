'use strict'

const LocationRepository = require('../repository/LocationRepository');

const testData1 = {
  "beaconID": "abc123",
  "grid": {"x": 120, "y": 110},
  "place": "lab2F_toilet",
  "time": 1523443296402,
};

const testData2 = {
  "beaconID": "abc1234",
  "grid": {"x": 120, "y": 100},
  "place": "lab2F_toilet",
  "time": 1523443298402,
};

const searchTimes = {
  "start": 1523443296402,
  "end"  : 1523443296402,
};

//順番を守るがためのネスト地獄ゆえ許せ
LocationRepository.addLocation(testData1).then((res) => {
  console.log(res);
    LocationRepository.addLocation(testData2).then((res) => {
    console.log(res);
    LocationRepository.getLocationByTime(testData1["beaconID"], searchTimes).then((res) => {
      console.log(res);
      LocationRepository.getLocationByBeaconIDOnly(testData2["beaconID"]).then((res) => {
        console.log(res);
      });
    });
  });

});
