var express = require('express');
var router = express.Router();
const panitLt3Controller = require("../controllers/panitLt3Controller");


// ! TO CONTROLLER
router.get("/", panitLt3Controller.getPanitLt3Dashboard);
router.get("/changeStatus", panitLt3Controller.changeStatusDashboard);
router.get("/revertDeliver", panitLt3Controller.revertDeliverLt3);
router.get("/revertPostpone", panitLt3Controller.revertPostponeLt3);
router.put("/deliver", panitLt3Controller.deliver);
router.put("/revert", panitLt3Controller.revert);
router.put("/postpone", panitLt3Controller.postpone);
router.put("/revertPostpone", panitLt3Controller.revertPostpone);



module.exports = router;


