const express = require("express");
const { route } = require("./messageRouter");
const {isAdmin , isPatient } = require("../middlewares/auth")
const { Appointment, getAllAppointment, updateAppointmentStatus, deleteAppointment, totalAppointment } = require("../Controllers/appointment");
const router = express.Router();


router.post("/post" , isPatient , Appointment);
router.get("/getall" , isAdmin , getAllAppointment);
router.get("/totalappointment" , isAdmin , totalAppointment);
router.put("/update/:id" , isAdmin , updateAppointmentStatus);
router.delete("/delete/:id" , isAdmin , deleteAppointment);

module.exports = router