import React, { useState, useEffect } from 'react';
import Sound from 'react-sound';

export default function AlertBuzzer(props) {
  const [status, setStatus] = useState(Sound.status.STOPPED);

  useEffect(() => {
    const trackers = props.trackers;
    if (trackers.length) {
      trackers.forEach(tracker => {
        console.log(tracker.alert);
        if (tracker.alert.keepOut >= 3.93 || tracker.alert.lost || tracker.alert.schedule >= 300) {
          setStatus(Sound.status.PLAYING);
        } else {
          setStatus(Sound.status.STOPPED);
        }
      });
    }
  }, [props.trackers]);

  return <Sound url={`${process.env.REACT_APP_API_URL}/warning.mp3`} playStatus={status} />;
}
