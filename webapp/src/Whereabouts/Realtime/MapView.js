import React, { useState, useEffect, useCallback, useRef } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import fetch from 'node-fetch';

import Map from '../Map';

export default function RealtimeMapView(props) {
  const [trackers, setTrackers] = useState([]);
  const [timerID, setTimerID] = useState(0);
  const refTimerID = useRef(timerID);

  useEffect(() => {
    refTimerID.current = timerID;
  }, [timerID]);

  const fetchTrackers = useCallback(() => {
    fetch('http://127.0.0.1:3000/api/tracker')
      .then(res => res.json())
      .then(json => {
        json = json.filter(tracker => {
          for (let chosen of props.chosenTrackers) {
            if (tracker.trackerID === chosen.ID) {
              return true;
            }
          }
          return false;
        });
        setTrackers(json);
      });
  }, [props.chosenTrackers]);

  useEffect(() => {
    clearInterval(refTimerID.current);
    setTimerID(setInterval(fetchTrackers, 1000));
    return () => clearInterval(refTimerID.current);
  }, [fetchTrackers]);

  return <P5Wrapper sketch={Map} trackers={trackers} />;
}
