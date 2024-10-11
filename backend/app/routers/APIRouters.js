const express = require('express');
const router = express.Router();
const APIController = require('../controllers/APIController');

const mapsController = new APIController();

router.post('/directions', mapsController.getDirections);

module.exports = router;
