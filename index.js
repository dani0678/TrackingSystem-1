'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const APIHandler = require('./service/APIHandlers');

const app = express();

app.use(bodyParser.json());

const server = app.listen(3000, () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

//WebPageHandlers
app.get('/', (request, response) => {
    response.send('hello world!');
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
app.get('/api/get/tracker', (request, response) => {
    APIHandler.getAllTracker(request, response)
});
app.get('/api/get/tracker/:id', (request, response) => {
    APIHandler.searchTrackerByName(request, response)
});
app.get('/api/startTracking', (request, response) => {
    APIHandler.startPositionTracking(request, response)
});

