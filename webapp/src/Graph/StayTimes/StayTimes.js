import React, { useState, useEffect, useCallback } from 'react';

import './StayTimes.scss';
import TermSelector from '../TermSelector';
import OnlyTrackerSelector from './OnlyTrackerSelector';
import GraphRender from './StayTimesGraphRender';
import _ from 'underscore';

export default function StayTimes() {
  const [datas, setDatas] = useState([]);
  const [chosenTrackers, setChosenTrackers] = useState([]);
  const [term, setTerm] = useState({});

  const fetchTrackers = useCallback((term, tracker) => {
    const url = new URL(`${process.env.REACT_APP_API_URL}/api/tracker/${tracker.ID}`);
    Object.keys(term).forEach(key => url.searchParams.append(key, term[key]));
    url.searchParams.append('needMapName', true);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        const rawData = json.Location.map(location => {
          return location.map;
        });
        const label = rawData.filter(function(x, i, self) {
          return self.indexOf(x) === i;
        });
        let locationData = [];
        label.forEach(label => {
          const count = rawData.filter(map => {
            return map === label;
          }).length;
          locationData.push({ label: label, count: count });
        });
        locationData = _.sortBy(locationData, item => {
          return item.label;
        });
        const sum = locationData.reduce((sum, location) => {
          return sum + location.count;
        }, 0);
        locationData.forEach(location => {
          location.count = Math.round((location.count / sum) * 100);
        });
        const processData = { name: tracker.name, locations: locationData };
        setDatas(processData);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(chosenTrackers).length && Object.keys(term).length) {
      fetchTrackers(term, chosenTrackers);
    }
  }, [fetchTrackers, chosenTrackers, term]);

  return (
    <div className="StayTimes">
      <div className="SideSelector">
        <OnlyTrackerSelector className="OnlyTrackerSelector" onChange={setChosenTrackers} />
        <br />
        <TermSelector className="TermSelector" onSend={setTerm} />
        <br />
      </div>
      <div className="Graph">
        <GraphRender data={datas} />
      </div>
    </div>
  );
}
