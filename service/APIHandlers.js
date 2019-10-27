"use strict";

const PositionTracking = require("./PositionTracking");
const DetectionDataRepository = require("../DetectionData/DetectionDataRepository");
const TrackerRepository = require("../Tracker/TrackerRepository");
const DetectorRepository = require("../Detector/DetectorRepository");
const MapRepository = require("../Map/MapRepository");
const MetaRepository = require("../Meta/MetaRepository");
const LocationRepository = require("../Location/LocationRepository");
const Alert = require("../Alert/Alert");
let timerID;

module.exports = class APIHandlers {
  static addDetectionData(req, res) {
    const detectionData = req.body;
    DetectionDataRepository.addDetectionData(detectionData).then(() => {
      res.send("DetectionData Add Success!");
    });
  }

  static addTracker(req, res) {
    const tracker = req.body;
    TrackerRepository.addTracker(tracker).then(() => {
      res.send("Tracker Add Success!");
    });
  }

  static addDetector(req, res) {
    const detector = req.body;
    DetectorRepository.addDetector(detector).then(() => {
      res.send("Detector Add Success!");
    });
  }

  static updateDetectorActiveLastTime(req, res) {
    const detector = req.body;
    DetectorRepository.updateDetectorActiveLastTime(detector).then(() => {
      res.send("Detector Active Time Updated!");
    });
  }

  static addMap(req, res) {
    const map = req.body;
    MapRepository.addMap(map).then(map => {
      res.json(map);
    });
  }

  static async getAllTracker(req, res) {
    let searchTime = {};
    if (req.query.start && req.query.end) {
      searchTime = {
        start: Number(req.query.start),
        end: Number(req.query.end)
      };
    }
    const trackers = await TrackerRepository.getAllTracker(searchTime);
    res.json(trackers);
  }

  static searchTrackerByID(req, res) {
    const trackerID = req.params.id;
    const needMapName = req.query.needMapName;
    let times = {};
    if (req.query.start && req.query.end) {
      times = {
        start: Number(req.query.start),
        end: Number(req.query.end)
      };
    }
    TrackerRepository.getTrackerByTrackerID(trackerID, times, needMapName).then(
        response => {
          res.json(response);
        }
    );
  }

  static searchTrackerByBeaconID(req, res) {
    const beaconID = req.params.id;
    const needMapName = req.query.needMapName;
    let times = {};
    if (req.query.start && req.query.end) {
      times = {
        start: Number(req.query.start),
        end: Number(req.query.end)
      };
    }
    TrackerRepository.getTrackerByBeaconID(beaconID, times, needMapName).then(
        response => {
          res.json(response);
        }
    );
  }

  static updateTrackerByID(req, res) {
    const trackerID = req.params.id;
    const newValueQuery = req.body;
    TrackerRepository.updateTracker(trackerID, newValueQuery).then(() => {
      res.send("Tracker Update Success!");
    });
  }

  static startPositionTracking(req, res) {
    timerID = setInterval(() => {
      const date = new Date();
      const startTime = date.getTime() - 1000;
      PositionTracking.updateLocations(startTime);
      Alert.check();
    }, 1000);
    res.send("Tracking Start!");
  }

  static stopPositionTracking(req, res) {
    clearInterval(timerID);
    res.send("Tracking Stop!");
  }

  static getDetector(req, res) {
    DetectorRepository.getDetector().then(detector => {
      res.send(detector);
    });
  }

  static deleteDetector(req, res) {
    const detectorId = req.body.detectorNumber;
    DetectorRepository.removeDetector(detectorId).then(() => {
      res.send("Successfully delete detector!");
    });
  }

  static putDetector(req, res) {
    const detector = req.body;
    DetectorRepository.updateDetector(detector).then(() => {
      res.send("Successfully put detector!");
    });
  }

  static getMap(req, res) {
    MapRepository.getAllMap().then(map => {
      res.send(map);
    });
  }

  static deleteMap(req, res) {
    const mapId = req.params.id;
    MapRepository.removeMap(mapId).then(() => {
      res.send("Successfully delete map!");
    });
  }

  static addMeta(req, res) {
    const meta = req.body;
    MetaRepository.addMeta(meta).then(() => {
      res.send("Meta Add Success!");
    });
  }

  static getMeta(req, res) {
    MetaRepository.getAllMeta().then(meta => {
      res.send(meta);
    });
  }

  static deleteMeta(req, res) {
    const metaId = req.params.id;
    MetaRepository.removeMeta(metaId).then(() => {
      res.send("Successfully delete meta!");
    });
  }

  static putMeta(req, res) {
    const meta = req.body;
    MetaRepository.updateMeta(meta).then(() => {
      res.send("Successfully put meta!");
    });
  }

  static getLocationByTimeAndMap(req, res) {
    const mapId = req.params.id;
    let searchTime = {};
    if (req.query.start && req.query.end) {
      searchTime = {
        start: Number(req.query.start),
        end: Number(req.query.end)
      };
    }
    LocationRepository.getLocationByTimeAndMap(mapId, searchTime)
      .then(locations => {
        res.send(locations);
      });
  }

};
