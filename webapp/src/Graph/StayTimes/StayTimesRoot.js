import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import StayTimes from './StayTimes';
export default function StayTimesRoot() {
  const [addedView, setAddedView] = useState([]);

  const addView = () => {
    const addedView_copy = addedView.slice();
    addedView_copy.push(<StayTimes />);
    setAddedView(addedView_copy);
  };

  return (
    <div className="StayTimesRoot">
      <StayTimes />
      {addedView}
      <Button variant="outlined" size={'large'} onClick={addView}>
        グラフを追加する
      </Button>
    </div>
  );
}
