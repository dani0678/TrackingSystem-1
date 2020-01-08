import React, { useState, useEffect } from 'react';
import List from './List/List';
import Form from './Form/Form';

export default function Tracker() {
  const [trackers, setTrackers] = useState([]);
  const [newTracker, setNewTracker] = useState({
    trackerName: '',
    beaconID: '',
    userStatus: ''
  });
  const trackerURL = new URL(`${process.env.REACT_APP_API_URL}/api/tracker`);

  useEffect(() => {
    fetch(trackerURL)
      .then(res => res.json())
      .then(json => {
        setTrackers(json);
      });
  }, [trackers]);

  return (
    <div className="Tracker">
      <div className="Form">
        <Form trackers={trackers} newTracker={newTracker} setNewTracker={setNewTracker} />
      </div>
      <div className="List">
        <List trackers={trackers} />
      </div>
    </div>
  );
}
