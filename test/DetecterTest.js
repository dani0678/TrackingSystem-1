'use strict'

const DetectorRepository = require('../repository/DetectorRepository');

const testData1 = {
        "detectorNumber": 1,
        "detectorGrid": {
            "x": 100,
            "y": 100
        },
        "detectorMap": "Lab1F_toilet"
};

const testData2 = {
        "detectorNumber": 2,
        "detectorGrid": {
            "x": 100,
            "y": 100
        },
        "detectorMap": "Lab1F_toilet"
};

const updateData = {
        "detectorNumber": 1,
        "detectorGrid": {
            "x": 150,
            "y": 120
        },
        "detectorMap": "Lab2F_toilet"
};

//順番を守るがためのネスト地獄ゆえ許せ
DetectorRepository.addDetector(testData1).then((res) => {
  console.log(res);

  DetectorRepository.addDetector(testData2).then((res) => {
    console.log(res);

    DetectorRepository.getDetector(1).then((res) => {
      console.log(res);

      DetectorRepository.updateDetector(updateData).then((res) => {
        console.log(res);

        DetectorRepository.getDetector(1).then((res) => {
          console.log(res);

          DetectorRepository.removeDetector(1).then(() => {
            console.log(res);
          });
        });
      });
    });
  });
});
