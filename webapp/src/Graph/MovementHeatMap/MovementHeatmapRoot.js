import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import MovementHeatMap from './MovementHeatMap';
export default function MovementHeatmapRoot() {
  const [addedView, setAddedView] = useState([]);

  const addView = () => {
    const addedView_copy = addedView.slice();
    addedView_copy.push(<MovementHeatMap />);
    setAddedView(addedView_copy);
  };

  return (
    <div className="StayTimesRoot">
      <MovementHeatMap />
      <br />
      {addedView}
      <br />
      <Button variant="outlined" size={'large'} onClick={addView}>
        グラフを追加する
      </Button>
    </div>
  );
}
