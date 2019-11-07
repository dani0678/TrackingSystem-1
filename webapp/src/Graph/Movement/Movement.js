import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';

import './Movement.scss';
import GraphRender from './MovementGraphRender';
import TermSelector from '../TermSelector';
import TrackerSelector from './TrackerSelector';

export default function Movement() {
  const [datas, setDatas] = useState([]);
  const data = useRef();
  const [chosenTrackers, setChosenTrackers] = useState([]);
  const [term, setTerm] = useState({});
  const [span, setSpan] = useState(60);

  useEffect(() => {
    data.current = datas;
  }, [datas]);

  const updateDataTrackers = useCallback(
    processData => {
      const index = data.current.findIndex(data => {
        return data.name === processData.name;
      });
      let datas_copy = data.current.slice();
      if (index !== -1) {
        datas_copy[index].location = processData.location;
      } else {
        datas_copy.push(processData);
      }
      datas_copy = datas_copy.filter(data => {
        for (let chosen of chosenTrackers) {
          if (data.name === chosen.name) {
            return true;
          }
        }
        return false;
      });
      setDatas(datas_copy);
    },
    [setDatas, chosenTrackers]
  );

  const fetchTrackers = useCallback(
    (term, tracker) => {
      const url = new URL(`http://127.0.0.1:3000/api/tracker/${tracker.ID}`);
      Object.keys(term).forEach(key => url.searchParams.append(key, term[key]));
      url.searchParams.append('needMapName', true);
      fetch(url)
        .then(res => res.json())
        .then(json => {
          let mapDatas = [];
          let timeLabel = [];
          json.Location.forEach(location => {
            mapDatas.push(location.map);
            timeLabel.push(moment(location.locatedTime).format('YYYY/MM/DD HH:mm:ss'));
          });
          [mapDatas, timeLabel] = extractEveryTerm(mapDatas, timeLabel, span);
          const processData = {
            name: tracker.name,
            location: { mapDatas: mapDatas, timeLabel: timeLabel }
          };
          updateDataTrackers(processData);
        });
    },
    [updateDataTrackers, span]
  );

  const extractEveryTerm = (mapDatas, timeLabel, term) => {
    const extractMapDatas = [mapDatas[0]];
    const extractTimeLabel = [timeLabel[0]];

    let count = 0;
    for (let index in mapDatas) {
      count++;
      if (count === term) {
        extractMapDatas.push(mapDatas[index]);
        extractTimeLabel.push(timeLabel[index]);
        count = 0;
      }
    }
    return [extractMapDatas.reverse(), extractTimeLabel.reverse()];
  };

  useEffect(() => {
    if (chosenTrackers.length && Object.keys(term).length) {
      for (let tracker of chosenTrackers) {
        fetchTrackers(term, tracker);
      }
    }
  }, [fetchTrackers, chosenTrackers, term]);

  return (
    <div className="Movement">
      <div className="SideSelector">
        <TrackerSelector className="TrackerSelector" onChange={setChosenTrackers} />
        <br />
        <TermSelector className="TermSelector" onSend={setTerm} />
        <br />
        <Select
          className="SpanSelector"
          value={span}
          onChange={(event, value) => setSpan(event.target.value)}
        >
          <MenuItem value={60}>1分</MenuItem>
          <MenuItem value={300}>5分</MenuItem>
          <MenuItem value={600}>10分</MenuItem>
          <MenuItem value={1800}>30分</MenuItem>
          <MenuItem value={3600}>1時間</MenuItem>
        </Select>
      </div>
      <div className="Graph">
        <GraphRender data={datas} />
      </div>
    </div>
  );
}

// 表も出す
