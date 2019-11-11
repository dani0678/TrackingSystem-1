import React, { useState, useEffect, useCallback } from 'react';

import './HeatMap.scss';
import TermSelector from '../TermSelector';
import OnlyTrackerSelector from '../StayTimes/OnlyTrackerSelector';
import ReactHeatmap from './ReactHeatmap';

export default function HeatMap() {
  const [datas, setDatas] = useState([]);
  const [chosenTrackers, setChosenTrackers] = useState([]);
  const [term, setTerm] = useState({});
  const mapWidth = Number(`${process.env.REACT_APP_API_MAP_WIDTH}`);
  const mapHeight = Number(`${process.env.REACT_APP_API_MAP_HEIGHT}`);

  const fetchTrackers = useCallback((term, tracker) => {
    const url = new URL(`${process.env.REACT_APP_API_URL}/api/tracker/${tracker.ID}`);
    Object.keys(term).forEach(key => url.searchParams.append(key, term[key]));
    fetch(url)
      .then(res => res.json())
      .then(trackers => {
        const sumOfGrid = [];
        trackers.Location.forEach(location => {
          const index = sumOfGrid.findIndex(grid => {
            return grid.x === location.grid.x && grid.y === location.grid.y;
          });
          if (index !== -1) {
            sumOfGrid[index].value++;
          } else {
            sumOfGrid.push({ x: location.grid.x, y: location.grid.y, value: 1 });
          }
        });
        setDatas(sumOfGrid);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(chosenTrackers).length && Object.keys(term).length) {
      fetchTrackers(term, chosenTrackers);
    }
  }, [fetchTrackers, chosenTrackers, term]);

  const heatMapStyle = {
    width: mapWidth,
    height: mapHeight,
    display: "flex",
    backgroundImage: `url(${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_MAP})`
  };

  return (
    <div className="Movement">
      <div className="SideSelector">
        <OnlyTrackerSelector className="OnlyTrackerSelector" onChange={setChosenTrackers} />
        <br />
        <TermSelector className="TermSelector" onSend={setTerm} />
        <br />
      </div>
      <div className="Graph">
        <div className="HeatMap" style={heatMapStyle}>
          <ReactHeatmap data={datas} />
        </div>
      </div>
    </div>
  );
}
