import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Detector from './Detector/Detector';
import Meta from './Meta/Meta';
import Room from './Room/Room';
import Tracker from './Tracker/Tracker';

export default function Setting() {
  return (
    <div className="Setting">
      <Tabs>
        <TabList>
          <Tab>入居者</Tab>
          <Tab>部屋</Tab>
          <Tab>ユニット</Tab>
          <Tab>受信機</Tab>
        </TabList>

        <TabPanel>
          <Tracker />
        </TabPanel>
        <TabPanel>
          <Room />
        </TabPanel>
        <TabPanel>
          <Meta />
        </TabPanel>
        <TabPanel>
          <Detector />
        </TabPanel>
      </Tabs>
    </div>
  );
}
