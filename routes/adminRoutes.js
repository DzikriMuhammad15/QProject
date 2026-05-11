var express = require('express');
var router = express.Router();
const adminController = require("../controllers/adminController");

// ! TO CONTROLLER
router.get("/", adminController.getAdminMain);
router.get("/verifyPanitLt1Dashboard", adminController.getVerifyPanitLt1Dashboard);
router.get("/verifyPanitLt2Dashboard", adminController.getVerifyPanitLt2Dashboard);
router.get("/verifyPanitLt3Dashboard", adminController.getVerifyPanitLt3Dashboard);
router.get("/verifyMudhohiDashboard", adminController.getVerifyMudhohiDashboard);
router.post("/postMudhohi", adminController.postMudhohi);
router.post("/postPanitLt1", adminController.postPanitLt1);
router.post("/postPanitLt2", adminController.postPanitLt2);
router.post("/postPanitLt3", adminController.postPanitLt3);
router.post("/postSapi", adminController.postSapi);
router.post("/postKambing", adminController.postKambing);

// Download snapshot sebagai data JSON (diproses menjadi Excel di client)
router.get("/snapshot", adminController.getSnapshotData);

module.exports = router;
