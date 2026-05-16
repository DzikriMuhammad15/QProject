var express = require('express');
var router = express.Router();
const panitLt3Controller = require("../controllers/panitLt3Controller");
const { upload, uploadToCloudinary } = require('../middleware/uploadMiddleware');

// ! TO CONTROLLER
router.get("/", panitLt3Controller.getPanitLt3Dashboard);
router.get("/changeStatus", panitLt3Controller.changeStatusDashboard);
router.get("/revertDeliver", panitLt3Controller.revertDeliverLt3);
router.get("/revertPostpone", panitLt3Controller.revertPostponeLt3);
router.put("/deliver", panitLt3Controller.deliver);
router.put("/revert", panitLt3Controller.revert);
router.put("/postpone", panitLt3Controller.postpone);
router.put("/revertPostpone", panitLt3Controller.revertPostpone);

// Route upload bukti foto ke Cloudinary (menggantikan Firebase Storage)
// Menerima form-data dengan field "bukti" (file gambar)
router.post("/uploadBukti", upload.single('bukti'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Tidak ada file yang diupload" });
        }
        const url = await uploadToCloudinary(req.file.buffer, 'qurban/bukti');
        res.status(200).json({ url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
