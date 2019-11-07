import React from 'react';
import HeatMap from 'react-heatmap-grid';

export default function MovementGraphRender(props) {
  return (
    <div style={{ fontSize: '13px' }}>
      <HeatMap
        xLabels={props.data.xLabels}
        yLabels={props.data.yLabels}
        xLabelsLocation={'bottom'}
        xLabelsVisibility={props.data.xLabelsVisibility}
        xLabelWidth={60}
        data={props.data.data}
        squares
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
          fontSize: '11.5px',
          color: '#000'
        })}
        cellRender={value => value && `${value}%`}
      />
    </div>
  );
}
