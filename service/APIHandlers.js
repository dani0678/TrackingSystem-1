'use strict';

const PositionTracking = require('./PositionTracking');
const DetectionDataRepository = require('../DetectionData/DetectionDataRepository');
const TrackerRepository = require('../Tracker/TrackerRepository');
const DetectorRepository = require('../Detector/DetectorRepository');
const MapRepository = require('../Map/MapRepository');
const Alart = require('../Alart/Alart');
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

    static addTracker(req, res) {
        const tracker = req.body;
        TrackerRepository.addTracker(tracker)
            .then(() => {
                res.send("Tracker Add Success!");
            });
    }

    static addTrackerMailAddr(req, res) {
        const trackerID = req.params.id;
        const addr = req.body;
        TrackerRepository.addTrackerMailAddr(trackerID, addr)
        .then(() => {
            res.send("TrackerAddr Update Success!");
        });
    }

    static startPositionTracking(req, res) {
        timerID = setInterval(() => {
            const date = new Date();
            const startTime = date.getTime()-1000;
            PositionTracking.updateLocations(startTime);
            Alart.check();
        }, 1000);
        res.send("Tracking Start!");
    }

    static stopPositionTracking(req, res) {
        clearInterval(timerID);
        res.send("Tracking Stop!");
    }
};