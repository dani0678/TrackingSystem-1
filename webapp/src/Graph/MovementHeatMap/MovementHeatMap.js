import React, { useState, useEffect, useCallback } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';

import './MovementHeatMap.scss';
import GraphRender from './MovementGraphRender';
import TermSelector from '../TermSelector';
import OnlyTrackerSelector from './OnlyTrackerSelector';

export default function MovementHeatMap() {
  const [datas, setDatas] = useState({ xLabels: [], yLabels: [], xLabelsVisibility: [], data: [] });
  const [chosenTrackers, setChosenTrackers] = useState([]);
  const [term, setTerm] = useState({});
  const [span, setSpan] = useState(60);

  const fetchTrackers = useCallback(
    (term, tracker) => {
      const url = new URL(`http://127.0.0.1:3000/api/tracker/${tracker.ID}`);
      Object.keys(term).forEach(key => url.searchParams.append(key, term[key]));
      url.searchParams.append('needMapName', true);
      fetch(url)
        .then(res => res.json())
        .then(json => {
          let rawData = [];
          let maps = [];
          let timeLabels = [];

          json.Location.forEach(location => {
            rawData.push({ map: location.map, time: location.locatedTime });
            maps.push(location.map);
            timeLabels.push(location.locatedTime);
          });

          rawData = rawData.reverse();
          maps = maps.reverse();
          timeLabels = timeLabels.reverse();

          timeLabels = makeXLabelByTerm(timeLabels, span);

          const xLabels = timeLabels.map(time => {
            return moment(time).format('HH:mm');
          });
          const yLabels = maps.filter(function(x, i, self) {
            return self.indexOf(x) === i;
          });

          const xLabelsVisibility = new Array(xLabels.length)
            .fill(0)
            .map((_, i) => (i % 4 === 0 ? true : false));

          const data = new Array(yLabels.length)
            .fill(0)
            .map(() => new Array(timeLabels.length).fill(0));

          for (let x in timeLabels) {
            if (Number(x) + 1 <= timeLabels.length - 1) {
              const filteredData = rawData.filter(data => {
                return data.time >= timeLabels[x] && data.time <= timeLabels[Number(x) + 1];
              });
              const allDataSize = filteredData.length;
              for (let y in yLabels) {
                const eachData = filteredData.filter(data => {
                  return data.map === yLabels[y];
                });
                data[y][x] = Math.floor((eachData.length / allDataSize) * 100);
              }
            }
          }
          //どうしても余分な1マスができちゃうので無理やり除去する
          xLabels.pop();
          xLabelsVisibility.pop();
          for (let y in yLabels) {
            data[y].pop();
          }

          const processData = {
            xLabels: xLabels,
            yLabels: yLabels,
            xLabelsVisibility: xLabelsVisibility,
            data: data
          };
          setDatas(processData);
        });
    },
    [span]
  );

  const makeXLabelByTerm = (timeLabel, span) => {
    const extractTimeLabel = [timeLabel[0]];

    let count = 0;
    for (let index in timeLabel) {
      count++;
      if (count === span) {
        extractTimeLabel.push(timeLabel[index]);
        count = 0;
      }
    }
    return extractTimeLabel;
  };

  useEffect(() => {
    if (Object.keys(chosenTrackers).length && Object.keys(term).length) {
      fetchTrackers(term, chosenTrackers);
    }
  }, [fetchTrackers, chosenTrackers, term]);

  return (
    <div className="Movement">
      <div className="SideSelector">
        <OnlyTrackerSelector className="TrackerSelector" onChange={setChosenTrackers} />
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
