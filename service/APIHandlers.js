'use strict'

const PositionTracking = require('./PositionTracking');
const DetectionDataRepository = require('../repository/DetectionDataRepository');
const TrackerRepository = require('../repository/TrackerRepository');
const DetectorRepository = require('../repository/DetectorRepository');
const MapRepository = require('../repository/MapRepository');

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

    static getAllTracker(req, res) {
        TrackerRepository.getAllTracker()
            .then((response) => {
                res.json(response);
            });
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
        setInterval(() => {
            const date = new Date();
            const startTime = date.getTime();
            PositionTracking.updateLocations(startTime);
        }, 1000);
        res.send("Tracking Start!");
    }
};