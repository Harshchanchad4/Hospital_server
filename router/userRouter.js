const express = require("express");
const { patientRegister, login, addNewAdmin, getAllDoctors, getUserDetails, logoutAdmin, logoutPatient, addNewDoctor } = require("../Controllers/user");
const { isAdmin, isPatient } = require("../middlewares/auth");
const { totalDoctors } = require("../Controllers/user");

const router = express.Router();

router.post("/patient/register" , patientRegister);
router.post("/login" , login);
router.post("/admin/addnew" , isAdmin ,  addNewAdmin);
router.get("/doctors" ,  getAllDoctors);
router.get("/admin/me" ,isAdmin,  getUserDetails);
router.get("/patient/me" ,isPatient,  getUserDetails);
router.get("/patient/logout" ,isPatient,  logoutPatient);
router.get("/admin/logout" ,isAdmin,  logoutAdmin);
router.post("/doctor/addnew" ,isAdmin,  addNewDoctor);
router.get("/doctor/totaldoctors" ,isAdmin,  totalDoctors);


module.exports = router