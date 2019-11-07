import React, { useState } from 'react';
import './Realtime.scss';
import MapView from './MapView';
import TrackerSelector from '../TrackerSelector';

export default function Realtime(props) {
  const [trackers, setTrackers] = useState([]);

  return (
    <div className="Realtime">
      <div className="Selector">
        <div className="TrackerSelector">
          <TrackerSelector onChange={setTrackers} />
        </div>
      </div>
      <div className="Map">
        <div className="MapView">
          <MapView chosenTrackers={trackers} />
        </div>
      </div>
    </div>
  );
}
