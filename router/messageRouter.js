const express  = require("express");
const { sendMessage, getAllMessages } = require("../Controllers/messageSend");
const { isAdmin, isPatient } = require("../middlewares/auth");

const router = express.Router();

router.post("/send" , sendMessage);
router.get("/getall" , isAdmin,  getAllMessages);


module.exports = router