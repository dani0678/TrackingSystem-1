import React, { useState, useEffect } from 'react';
import Form from './Form/Form';
import ScheduleList from './List/List';

export default function Schedule() {
  const [unitList, setUnitList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [trackerList, setTrackerList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    openingTime: new Date(),
    closingTime: new Date(),
    unit: '',
    room: '',
  });

  const scheduleURL = new URL(`${process.env.REACT_APP_API_URL}/api/schedule`);
  const metaURL = new URL(`${process.env.REACT_APP_API_URL}/api/meta`);
  const mapURL = new URL(`${process.env.REACT_APP_API_URL}/api/map`);
  const trackerURL = new URL(`${process.env.REACT_APP_API_URL}/api/tracker`);

  useEffect(() => {
    fetch(scheduleURL)
      .then(res => res.json())
      .then(json => {
        setScheduleList(json);
      });
  }, [scheduleList]);

  useEffect(() => {
    fetch(metaURL)
      .then(res => res.json())
      .then(json => {
        setUnitList(json);
      });
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
    <div className="Schedule">
      <div className="Form">
        <Form
          newSchedule={newSchedule}
          setNewSchedule={setNewSchedule}
          unitList={unitList}
          roomList={roomList}
        />
      </div>
      <div className="List">
        <ScheduleList
          unitList={unitList}
          roomList={roomList}
          scheduleList={scheduleList}
          trackerList={trackerList}
        />
      </div>
    </div>
  );
}
