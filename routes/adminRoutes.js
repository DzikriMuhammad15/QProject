var express = require('express');
var router = express.Router();
const adminController = require("../controllers/adminController")



// ! TO CONTROLLER
router.get("/", adminController.getAdminMain);
router.get("/verifyPanitLt1Dashboard", adminController.getVerifyPanitLt1Dashboard)
router.post("/postMudhohi", adminController.postMudhohi);
router.post("/postPanitLt1", adminController.postPanitLt1);
router.post("/postPanitLt2", adminController.postPanitLt2);
router.post("/postPanitLt3", adminController.postPanitLt3);
router.post("/postSapi", adminController.postSapi);

module.exports = router;


