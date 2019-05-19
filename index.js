'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const APIHandler = require('./service/APIHandlers');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('ui'));

const server = app.listen((process.env.PORT || 3000), () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

//WebPageHandlers
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/ui/main.html');
});

app.get('/userDashBoard', (request, response) => {
    response.sendFile(__dirname + '/ui/dist/index.html');
});

//DetectionData
app.post('/api/detectionData', (request, response) => {
    APIHandler.addDetectionData(request, response)
});

//Tracker
app.get('/api/tracker', (request, response) => {
    APIHandler.getAllTracker(request, response)
});

app.get('/api/tracker/raw', (request, response) => {
    APIHandler.getAllTrackerRaw(request, response)
});

app.get('/api/tracker/:id', (request, response) => {
    APIHandler.searchTrackerByID(request, response)
});

app.post('/api/tracker', (request, response) => {
    APIHandler.addTracker(request, response)
});

//Detector
app.post('/api/detector', (request, response) => {
    APIHandler.addDetector(request, response)
});

//Map
app.post('/api/map', (request, response) => {
    APIHandler.addMap(request, response)
});


app.post('/api/trackerAddr/:id', (request, response) => {
    APIHandler.addTrackerMailAddr(request, response)
});

//TrackingManagement
app.get('/api/startTracking', (request, response) => {
    APIHandler.startPositionTracking(request, response)
});

app.get('/api/stopTracking', (request, response) => {
    APIHandler.stopPositionTracking(request, response)
});

