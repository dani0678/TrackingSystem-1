import React, { useEffect, useRef } from 'react';
import Heatmap from 'heatmap.js';

export default function ReactHeatmap(props) {
  const heatmapDOM = useRef();
  useEffect(() => {
    const heatmap = Heatmap.create({
      container: heatmapDOM.current,
      maxOpacity: 0.6,
      radius: 10,
      blur: 1
    });
    heatmap.setData({ data: props.data });
  }, [props.data]);

  return <div ref={heatmapDOM} style={{ width: '100%', height: '100%' }}></div>;
}
