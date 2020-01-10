import React, { useState, useEffect } from 'react';
import List from './List/List';

export default function CompareSchedule() {
  const [roomList, setRoomList] = useState([]);
  const [trackerList, setTrackerList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);

  const scheduleURL = new URL(`${process.env.REACT_APP_API_URL}/api/schedule`);
  const mapURL = new URL(`${process.env.REACT_APP_API_URL}/api/map`);
  const trackerURL = new URL(`${process.env.REACT_APP_API_URL}/api/tracker`);

  useEffect(() => {
    fetch(mapURL)
      .then(res => res.json())
      .then(json => {
        setRoomList(json);
      });
    fetch(scheduleURL)
      .then(res => res.json())
      .then(json => {
        setScheduleList(json);
      });
    fetch(trackerURL)
      .then(res => res.json())
      .then(json => {
        setTrackerList(json);
      });
  }, []);

  return (
    <div className="CompareSchedule">
      <div className="List">
        <List trackers={trackerList} schedules={scheduleList} rooms={roomList} />
      </div>
    </div>
  );
}
