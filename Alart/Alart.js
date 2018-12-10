'use strict';

const mailer = require('nodemailer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const TrackerRepository = require('../tracker/TrackerRepository');

const Lost = require("./Lost");
const KeepOut = require("./KeepOut");

module.exports = class Alart {
    static async check(){
        const trackers = await TrackerRepository.getAllTracker();

        for(let tracker of trackers){
            const lostResult = Lost.check(tracker);
            const keepOutResult = KeepOut.check(tracker);

            if (lostResult || keepOutResult) {
                const message = lostResult + "/n" + keepOutResult;
                this.sendMail(tracker, message);
            }
        }
    }

    static sendMail(tracker, message){
        const setting = {
            service: config.Mail.Service,
            auth: {
                user: config.Mail.User,
                pass: config.Mail.Pass,
                port: '25'
            }
        };
        const date = new Date();
        if(this.abs(date.getTime() - tracker.mailTimeStamp) > 600000 || tracker.mailTimeStamp === 0){

            const smtp = mailer.createTransport('SMTP', setting);

            for(let addless of tracker.notifyAddressList){
                let mailOptions = {
                    from: config.Mail.User,
                    to: addless,
                    subject: 'TrackingSystemAlart',
                    html: message
                };

                smtp.sendMail(mailOptions, function(err, res){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Message sent: ' + res.message);
                        return;
                    }
                });
            }
            smtp.close();
            tracker.mailTimeStamp = date.getTime();
        }
    }

    static abs(val) {
        return val < 0 ? -val : val;
    }
};