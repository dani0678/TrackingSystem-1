'use strict'

const _ = require('underscore');
const fs = require('fs');
const TrackerRepository = require('../repository/TrackerRepository');
const DetectorRepository = require('../repository/DetectorRepository');
const DetectionDataRepository = require('../repository/DetectionDataRepository');
const LocationRepository = require('../repository/LocationRepository');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const weightOfMedian = config.Weight.Median;
const weightOfDistance = config.Weight.Distance;

module.exports = class PositionTracking {
    static async updateLocations(calcTime) {
        const allTrackers = await TrackerRepository.getAllTracker();
        const calcTimeQuery = {
                "start": calcTime-250,
                "end"  : calcTime+250,
        };
        for(let tracker of allTrackers) {
            const detectionDatas = await DetectionDataRepository.getDetectionData(tracker.beaconID, calcTimeQuery);
            const dataGroupByDetectorNum = _.groupBy(detectionDatas, 'detectorNumber');

            let fixedDetectionDatas = [];
            for(let detectorNum in dataGroupByDetectorNum) {
                const sortedDetectorData =_.sortBy(dataGroupByDetectorNum[detectorNum], 'RSSI');
                const median = sortedDetectorData[sortedDetectorData.length/2].RSSI;

                let aveRSSI = 0;
                for(let detectorData of sortedDetectorData) {
                    if(detectorData.RSSI <= median+weightOfMedian && detectorData.RSSI >= median-weightOfMedian) {
                        aveRSSI += detectorData.RSSI;
                    }
                }

                aveRSSI = aveRSSI/sortedDetectorData.length;

                let fixedDetectionData = {
                    detectorNumber: detectorNum,
                    RSSI: aveRSSI,
                    TxPower: dataGroupByDetectorNum[detectorNum].TxPower,
                    numOfDataForAve: sortedDetectorData.length
                };

                fixedDetectionDatas.push(fixedDetectionData);
            }

            const beaconAxis = await this.positionCalc(tracker.beaconID, fixedDetectionDatas);
            LocationRepository.addLocation(beaconAxis);
        }
    }

    static async positionCalc(beaconID, detectionDatas) {
        let beaconAxis = {
            beaconID: beaconID,
            grid: {x: 0, y: 0},
            weight: 0,
            place: "",
            time: 0,
        };

        for(let detectionData of detectionDatas) {
            const detector = await DetectorRepository.getDetector(detectionData.detectorNumber);
            const weightForCalc = detectionData.numOfDataForAve/detectionDatas.length;
            detectionData.distance = 10 ** ((detectionData.TxPower - detectionData.RSSI)/10 * weightOfDistance);

            beaconAxis.grid.x += detector.grid.x/detectionData.distance * weightForCalc;
            beaconAxis.grid.y += detector.grid.y/detectionData.distance * weightForCalc;
            beaconAxis.weight += 1/detectionData.distance * weightForCalc;
        }

        beaconAxis.grid.x = beaconAxis.grid.x/beaconAxis.weight;
        beaconAxis.grid.y = beaconAxis.grid.y/beaconAxis.weight;

        const sortedDetectorDataByDistance =_.sortBy(detectionDatas, 'distance');
        beaconAxis.place = sortedDetectorDataByDistance[0].place;
        const date = new Date();
        beaconAxis.time = date.getTime();
        delete beaconAxis.weight;

        return beaconAxis;
    }
};