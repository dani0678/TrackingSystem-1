import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

export default function OnlyTrackerSelector(props) {
  const [items, setItems] = useState({});

  if (!items.length) {
    fetch('http://127.0.0.1:3000/api/tracker')
      .then(res => res.json())
      .then(json => {
        const items = json.map(item => {
          return { name: item.trackerName, ID: item.trackerID };
        });
        setItems(items);
      });
  }

  const itemSelect = event => {
    const item = items.find(item => {
      return item.ID === event.target.value;
    });
    props.onChange(item);
  };

  const menu = [];
  if (items.length) {
    for (let item of items) {
      menu.push(
        <div key={item.ID}>
          <Radio type="checkbox" value={item.ID} color="primary" />
          {item.name}
        </div>
      );
    }
  }
  return <RadioGroup onChange={itemSelect}>{menu}</RadioGroup>;
}
