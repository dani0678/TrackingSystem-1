'use strict';

const fs = require('fs');
const _ = require('underscore');

module.exports = class KeepOut {
    static check(tracker){
        const keepOutList = JSON.parse(fs.readFileSync('./keepOutMapList.json', 'utf-8'));
        for(let map of keepOutList['map']){
            if(tracker.location){
                if(map.name == tracker.location.map && _.indexOf(map.IDList, tracker.trackerID) != -1){
                    tracker.alart.keepOut = true;
                    return name + "さんが" + location.map.name + "に侵入しています！";
                }else{
                    tracker.alart.keepOut = false;
                    return null;
                }
            }
        }
    }

    static abs(val) {
        return val < 0 ? -val : val;
    }
};