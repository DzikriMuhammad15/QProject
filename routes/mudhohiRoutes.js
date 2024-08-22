var express = require('express');
var router = express.Router();
const mudhohiController = require("../controllers/mudhohiController");


// ! TO CONTROLLER
router.get("/", mudhohiController.getMudhohiDashboard);

module.exports = router