import React, { useState } from 'react';
import './Playback.scss';
import PlaybackMapView from './MapView';
import TrackerSelector from '../TrackerSelector';
import PlaybackTermSelector from '../TermSelector';
import PlaybackSelectorBottom from './SelectorBottom/SelectorBottom';

export default function Playback(props) {
  const [trackers, setTrackers] = useState([]);
  const [chosenTrackers, setChosenTrackers] = useState([]);
  const [time, setTime] = useState(0);

  const fetchTrackers = term => {
    const url = new URL(`${process.env.REACT_APP_API_URL}/api/tracker` || 'http://127.0.0.1:3000/api/tracker');
    Object.keys(term).forEach(key => url.searchParams.append(key, term[key]));
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setTrackers(json);
      });
  };

  return (
    <div className="Playback">
      <div className="Selector">
        <div className="TrackerSelector">
          <TrackerSelector onChange={setChosenTrackers} />
        </div>
        <div className="PlaybackTermSelector">
          <PlaybackTermSelector onSend={fetchTrackers} />
        </div>
      </div>
      <div className="Map">
        <div className="MapView">
          <PlaybackMapView chosenTrackers={chosenTrackers} trackers={trackers} time={time} />
        </div>
        <div className="TimeSlider">
          <PlaybackSelectorBottom trackers={trackers} onChange={setTime} />
        </div>
      </div>
    </div>
  );
}
