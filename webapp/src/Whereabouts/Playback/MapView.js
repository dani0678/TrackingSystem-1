import React, { useState, useEffect, useRef } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import _ from 'underscore';

import Map from '../Map';

export default function PlaybackMapView(props) {
  const [shownTrackers, setShownTrackers] = useState([]);
  const allTrackers = useRef();

  useEffect(() => {
    allTrackers.current = props.trackers;
  }, [props.trackers]);

  useEffect(() => {
    const filteredTrackers = allTrackers.current.filter(tracker => {
      for (let chosen of props.chosenTrackers) {
        if (tracker.trackerID === chosen.ID) {
          return true;
        }
      }
      return false;
    });
    const trackers = filteredTrackers.map(tracker => {
      return {
        trackerName: tracker.trackerName,
        trackerID: tracker.trackerID,
        beaconID: tracker.beaconID,
        userImage: tracker.userImage,
        userStatus: tracker.userStatus,
        alert: tracker.alert,
        notifyAddressList: tracker.notifyAddressList,
        mailTimeStamp: tracker.mailTimeStamp,
        Location: _.find(tracker.Location, location => {
          return (
            location.locatedTime < props.time + 1000 && location.locatedTime > props.time - 1000
          );
        })
      };
    });
    setShownTrackers(trackers);
  }, [props.chosenTrackers, props.time]);

  return <P5Wrapper sketch={Map} trackers={shownTrackers} />;
}
