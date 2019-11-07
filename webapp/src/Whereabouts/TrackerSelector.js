import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default function TrackerSelector(props) {
  const [items, setItems] = useState({});

  if (!items.length) {
    fetch('http://127.0.0.1:3000/api/tracker')
      .then(res => res.json())
      .then(json => {
        const items = json.map(item => {
          return { name: item.trackerName, ID: item.trackerID, checked: false };
        });
        setItems(items);
      });
  }

  const itemSelect = event => {
    const index = items.findIndex(item => {
      return item.ID === event.target.value;
    });
    const items_copy = items.slice();
    items_copy[index].checked = !items_copy[index].checked;
    setItems(items_copy);
    props.onChange(
      items.filter(item => {
        return item.checked === true;
      })
    );
  };

  const menu = [];
  if (items.length) {
    for (let item of items) {
      menu.push(
        <div key={item.ID}>
          <Checkbox type="checkbox" value={item.ID} onChange={itemSelect} color="primary" />
          {item.name}
        </div>
      );
    }
  }
  return <div>{menu}</div>;
}
