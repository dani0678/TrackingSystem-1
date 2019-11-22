import React, { useState, useEffect } from 'react';
import Sound from 'react-sound';

export default function AlertBuzzer(props) {
  const [status, setStatus] = useState(Sound.status.STOPPED);

  useEffect(() => {
    const trackers = props.trackers;
    if (trackers.length) {
      trackers.forEach( (tracker) => {
        if (tracker.alert.keepOut || tracker.alert.lost) {
          setStatus(Sound.status.PLAYING);
        } else {
          setStatus(Sound.status.STOPPED);
        }
      })
    }
  }, [props.trackers]);


  return <Sound url={`${process.env.REACT_APP_API_URL}/warning.mp3`} playStatus={status}/>;
}
