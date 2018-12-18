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

//APIHandlers
app.post('/api/add/detectionData', (request, response) => {
    APIHandler.addDetectionData(request, response)
});
app.post('/api/add/tracker', (request, response) => {
    APIHandler.addTracker(request, response)
});
app.post('/api/add/detector', (request, response) => {
    APIHandler.addDetector(request, response)
});
app.post('/api/add/map', (request, response) => {
    APIHandler.addMap(request, response)
});
app.post('/api/add/trackerAddr/:id', (request, response) => {
    APIHandler.addTrackerMailAddr(request, response)
});

app.get('/api/get/tracker', (request, response) => {
    APIHandler.getAllTracker(request, response)
});
app.get('/api/get/tracker/raw', (request, response) => {
    APIHandler.getAllTrackerRaw(request, response)
});
app.get('/api/get/tracker/:id', (request, response) => {
    APIHandler.searchTrackerByID(request, response)
});
app.get('/api/startTracking', (request, response) => {
    APIHandler.startPositionTracking(request, response)
});

app.get('/api/stopTracking', (request, response) => {
    APIHandler.stopPositionTracking(request, response)
});

