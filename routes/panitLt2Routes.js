var express = require('express');
var router = express.Router();
const panitLt2Controller = require("../controllers/panitLt2Controller");

// ! TO CONTROLLER
router.get("/", panitLt2Controller.getPanitLt2Dashboard);
router.get("/setPemrosesanDagingDashboard", panitLt2Controller.setPemrosesanDagingDashboard);
router.get("/revertPemrosesanDagingDashboard", panitLt2Controller.revertPemrosesanDagingDashboard);
router.get("/setReadyDeliverDashboard", panitLt2Controller.setReadyDeliverDashboard);
router.get("/revertReadyDeliverDashboard", panitLt2Controller.revertReadyDeliverDashboard);
router.put("/setReadyDeliver", panitLt2Controller.setReadyDeliver);
router.put("/revertReadyDeliver", panitLt2Controller.revertReadyDeliver);
router.put("/pemrosesanDaging", panitLt2Controller.pemrosesanDaging);
router.put("/revertPemrosesanDaging", panitLt2Controller.revertPemrosesanDaging);

module.exports = router;