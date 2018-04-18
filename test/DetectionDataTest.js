'use strict'

const DetectionDataRepository = require('../repository/DetectionDataRepository');

const testData1 = {
  "detectorNumber": 1,
  "RSSI": -76,
  "TxPower": -86,
  "beaconID": "abc123",
  "detectedTime": 1523443296402,
};

const testData2 = {
  "detectorNumber": 1,
  "RSSI": -89,
  "TxPower": -86,
  "beaconID": "abc123",
  "detectedTime": 1523443297402,
};

const searchTimes = {
  "start": 1523443294402,
  "end"  : 1523443299402,
};

//順番を守るがためのネスト地獄ゆえ許せ
DetectionDataRepository.addDetectionData(testData1).then((res) => {
  console.log(res);
  DetectionDataRepository.addDetectionData(testData2).then((res) => {
    console.log(res);
    DetectionDataRepository.getDetectionData("abc123", searchTimes).then((res) => {
      console.log(res);
    });
  });

});
