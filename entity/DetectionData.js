'use strict'

module.exports = class DetectorData {
  constructor(detectorNumber, RSSI, TxPower, beaconID, detectedTime){
    this.detectorNumber = detectorNumber;
    this.RSSI = RSSI;
    this.TxPower = TxPower;
    this.beaconID = beaconID;
    this.detectedTime = detectedTime;
  }
};
