'use strict';

const fs = require('fs');

module.exports = class Lost {
    constructor(){
        this.alartTime = 10000;
    }

    static check(tracker){
        const date = new Date();
        if(tracker.location){
            if(this.abs(date.getTime() - tracker.location.time) > this.alartTime){
                tracker.alart.lost = true;
                return name + "さんを見失いました！";
            }else{
                tracker.alart.lost = false;
                return null;
            }
        }
    }

    static abs(val) {
        return val < 0 ? -val : val;
    }
};