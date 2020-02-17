'use strict';

const Handler = require('./Handler');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  Handler.getSchedule(request, response);
});

router.get('/:id', (request, response) => {
  Handler.selectSchedule(request, response);
});

router.post('/', (request, response) => {
  Handler.addSchedule(request, response);
});

router.put('/:id', (request, response) => {
  Handler.putSchedule(request, response);
});

router.delete('/:id', (request, response) => {
  Handler.deleteSchedule(request, response);
});

module.exports = router;
