import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Realtime from './Realtime/Realtime';
import Playback from './Playback/Playback';
import ListUpTrackerByMap from './ListUpTrackerByMap/ListUpTrackerByMap';
import CompareSchedule from './CompareSchedule/CompareSchedule';

export default function Whereabouts() {
  return (
    <div className="Whereabouts">
      <Tabs>
        <TabList>
          <Tab>リアルタイム</Tab>
          <Tab>プレイバック</Tab>
          <Tab>入所者所在検索</Tab>
          <Tab>スケジュール比較</Tab>
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
        <TabPanel>
          <CompareSchedule />
        </TabPanel>
      </Tabs>
    </div>
  );
}
