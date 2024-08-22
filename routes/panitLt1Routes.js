var express = require('express');
var router = express.Router();
const panitLt1Controller = require("../controllers/panitLt1Controller");

// ! TO CONTROLLER
router.get("/", panitLt1Controller.getPanitLt1Dashboard);
router.get("/changeStatus", panitLt1Controller.getChangeStatusPanitLt1Dashboard);
router.get("/revertStatus", panitLt1Controller.getRevertStatusPanitLt1Dashboard);
router.put("/sembelih", panitLt1Controller.sembelih);
router.put("/revertSembelih", panitLt1Controller.revertSembelih);

module.exports = router;