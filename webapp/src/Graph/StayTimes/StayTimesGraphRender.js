import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

export default function StayTimesGraphRender(props) {
  const [data, setData] = useState({});
  const option = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
          }
        }
      ]
    },
    responsive: true
  };

  useEffect(() => {
    if (Object.keys(props.data).length) {
      const data = {
        labels: props.data.locations.map(location => {
          return location.label;
        }),
        datasets: [
          {
            label: props.data.name,
            backgroundColor: '#2E9AFE',
            data: props.data.locations.map(location => {
              return location.count;
            })
          }
        ]
      };
      setData(data);
    }
  }, [props.data]);

  return (
    <div className="Movement">
      <Bar data={data} options={option} height={320} width={1020} />
    </div>
  );
}
