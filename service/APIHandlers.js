'use strict'

const PositionTracking = require('./PositionTracking');
const DetectionDataRepository = require('../repository/DetectionDataRepository');
const TrackerRepository = require('../repository/TrackerRepository');
const DetectorRepository = require('../repository/DetectorRepository');

module.exports = class APIHandlers {
    static addDetectionData(req, res) {
        const detectionData = req.body;
        DetectionDataRepository.addDetectionData(detectionData)
            .then(() => {
                res.write("DetectionData Add Success!");
            });
    }

    static addTracker(req, res) {
        const tracker = req.body;
        TrackerRepository.addTracker(tracker)
            .then(() => {
                res.write("Tracker Add Success!");
            });
    }

    static addDetector(req, res) {
        const detector = req.body;
        DetectorRepository.addDetector(detector)
            .then(() => {
                res.write("Detector Add Success!");
            });
    }

    static getAllTracker(req, res) {
        TrackerRepository.getAllTracker()
            .then((response) => {
                res.json(response);
            });
    }

    static searchTrackerByName(req, res) {
        const trackerName = req.params.id;
        const times = req.body;
        TrackerRepository.getTrackerByTrackerName(trackerName, times)
            .then((response) => {
                res.json(response);
            });
    }

    static startPositionTracking(req, res) {
        setInterval(() => {
            const date = new Date();
            const startTime = date.getTime();
            PositionTracking.updateLocations(startTime);
        }, 500);
    }
};