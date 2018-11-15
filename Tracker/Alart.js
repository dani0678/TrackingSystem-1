'use strict';

const mailer = require('nodemailer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

module.exports = class Alart {
    constructor(){
        this.alart = {lost: false, keepOut: false};
        this.alartTime = 10000;
        this.notifyAddressList = [];
        this.keepOutMap = [];
    }

    lostCheck(location, name){
        const date = new Date();
        if(this.abs(date.getTime() - location.time) > this.alartTime){
            this.alart.lost = true;
            this.sendMail(name + "さんを見失いました！");
        }else{
            this.alart.lost = false;
        }
    }

    keepOutCheck(location, name){
        for(let map of this.keepOutMap){
            if(map == location.map){
                this.alart.keepOut = true;
                this.sendMail(name + "さんが" + location.map.name + "に侵入しています！");
            }else{
                this.alart.keepOut = false;
            }
        }
    }

    sendMail(message){
        const setting = {
            service: config.Mail.Service,
            auth: {
                user: config.Mail.User,
                pass: config.Mail.Pass,
                port: '25'
            }
        };
        const smtp = mailer.createTransport('SMTP', setting);

        for(let addless of this.notifyAddressList){
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
                }
            });
        }
        smtp.close();
    }

    static abs(val) {
        return val < 0 ? -val : val;
    }


};