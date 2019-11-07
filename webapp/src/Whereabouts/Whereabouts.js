import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Realtime from './Realtime/Realtime';
import Playback from './Playback/Playback';
import ListUpTrackerByMap from "./ListUpTrackerByMap/ListUpTrackerByMap";

export default function Whereabouts() {
  return (
    <div className="Whereabouts">
      <Tabs>
        <TabList>
          <Tab>リアルタイム</Tab>
          <Tab>プレイバック</Tab>
          <Tab>入居者所在検索</Tab>
        </TabList>

        <TabPanel>
          <Realtime />
        </TabPanel>
        <TabPanel>
          <Playback />
        </TabPanel>
        <TabPanel>
          <ListUpTrackerByMap />
        </TabPanel>
      </Tabs>
    </div>
  );
}
