'use strict';

const PositionTracking = require('./PositionTracking');
const DetectionDataRepository = require('../repository/DetectionDataRepository');
const TrackerRepository = require('../repository/TrackerRepository');
const DetectorRepository = require('../repository/DetectorRepository');
const MapRepository = require('../repository/MapRepository');
let timerID;

module.exports = class APIHandlers {
    static addDetectionData(req, res) {
        const detectionData = req.body;
        DetectionDataRepository.addDetectionData(detectionData)
            .then(() => {
                res.send("DetectionData Add Success!");
            });
    }

    static addTracker(req, res) {
        const tracker = req.body;
        TrackerRepository.addTracker(tracker)
            .then(() => {
                res.send("Tracker Add Success!");
            });
    }

    static addDetector(req, res) {
        const detector = req.body;
        DetectorRepository.addDetector(detector)
            .then(() => {
                res.send("Detector Add Success!");
            });
    }

    static addMap(req, res) {
        const map = req.body;
        MapRepository.addMap(map)
            .then(() => {
                res.send("Map Add Success!");
            });
    }

    static async getAllTracker(req, res) {
        const trackers = await TrackerRepository.getAllTracker();
        for(let tracker of trackers) {
            const map = await MapRepository.getMap(tracker.Location.place);
            tracker.Location.grid.x = (map.mapSize.max.x - map.mapSize.min.x)/2 + map.mapSize.min.x;
            tracker.Location.grid.y = (map.mapSize.max.y - map.mapSize.min.y)/2 + map.mapSize.min.y;
        }
        res.json(trackers);
    }

    static async getAllTrackerRaw(req, res) {
        const trackers = await TrackerRepository.getAllTracker();
        res.json(trackers);
    }

    static searchTrackerByID(req, res) {
        const trackerID = req.params.id;
        const times = req.body;
        TrackerRepository.getTrackerByTrackerID(trackerID, times)
            .then((response) => {
                res.json(response);
            });
    }

    static startPositionTracking(req, res) {
        timerID = setInterval(() => {
            const date = new Date();
            const startTime = date.getTime()-1000;
            PositionTracking.updateLocations(startTime);
        }, 1000);
        res.send("Tracking Start!");
    }

    static stopPositionTracking(req, res) {
        clearInterval(timerID);
        res.send("Tracking Stop!");
    }
};