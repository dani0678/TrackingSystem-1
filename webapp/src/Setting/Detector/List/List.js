import React from 'react';
import './List.scss';
import _ from 'underscore';

export default function List(props) {
  const unixTime2ymd = intTime => {
    const d = new Date(intTime);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = ('0' + d.getDate()).slice(-2);
    const hour = ('0' + d.getHours()).slice(-2);
    const min = ('0' + d.getMinutes()).slice(-2);
    const sec = ('0' + d.getSeconds()).slice(-2);

    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  };

  const makeListFromDetectorData = detectors => {
    detectors = _.sortBy(detectors, detector => {
      return detector.detectorNumber;
    });

    if (detectors) {
      return detectors.map(detector => {
        return (
          <tr key={detector.detectorNumber}>
            <td>{detector.detectorNumber}</td>
            <td>{unixTime2ymd(detector.detectorActiveLastTime)}</td>
            <td>{detector.IPAddress ? detector.IPAddress : 'None'}</td>
            <td>{detector.SSID ? detector.SSID : 'None'}</td>
          </tr>
        );
      });
    }
  };

  return (
    <table className="detectorStatusList">
      <thead>
        <tr>
          <th>Number</th>
          <th>ActiveLastTime</th>
          <th>IPAddress</th>
          <th>SSID</th>
        </tr>
      </thead>
      <tbody>{makeListFromDetectorData(props.detectors)}</tbody>
    </table>
  );
}
