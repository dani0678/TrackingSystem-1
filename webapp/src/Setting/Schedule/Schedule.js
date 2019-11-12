import React, { useState, useEffect } from 'react';
import Form from './Form/Form';
import List from './List/List';

export default function Schedule() {
  const [unitList, setUnitList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    openingTime: new Date(),
    closingTime: new Date(),
    unit: '',
    room: '',
  });

  const scheduleURL = new URL('http://127.0.0.1:3000/api/schedule');
  const metaURL = new URL('http://127.0.0.1:3000/api/meta');
  const mapURL = new URL('http://127.0.0.1:3000/api/map');

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
        <List unitList={unitList} roomList={roomList} scheduleList={scheduleList} />
      </div>
    </div>
  );
}
