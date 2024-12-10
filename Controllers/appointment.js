const User = require("../Models/User");
const Appointment = require("../Models/Appointment");
const { toast } = require("react-toastify");

exports.Appointment = async (req, res, next) => {
    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            nic,
            appointment_date,
            department,
            doctor_firstName,
            hasVisited,
            doctor_lastName,
            address,


        } = req.body;

        console.log("first  :", firstName);
        console.log("last  :", lastName);
        console.log("enail  :", email);
        console.log("phone  :", phone);
        console.log("gen  :", gender);
        console.log("  dob:", dob);
        console.log("nic  :", nic);
        console.log("appointment_date  :", appointment_date);
        console.log(" department :", department);
        console.log("doctor_firstName  :", doctor_firstName);
        console.log(" doctor_lastName :", doctor_lastName);
        console.log(" hasVisited :", hasVisited);
        console.log("address  :", address);


        if (
            !firstName || !lastName || !email || !phone || !gender || !dob || !
            nic || !appointment_date || !department || !doctor_firstName || !doctor_lastName
            || !address

        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });


        }

        const isConflict = await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department
        });

        console.log("ISCONFLICT  ", isConflict);

        if (isConflict.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Doctor not found"
            });

        }

        if (isConflict.length > 1) {
            return res.status(400).json({
                success: false,
                message: "Doctors COnflict Please contact Through email or phone"
            });

        }

        const doctorId = isConflict[0]._id;
        const patientId = req.user._id;

        console.log("doc_id: ", doctorId);
        console.log("pat_id: ", patientId);

        const appointment = await Appointment.create({
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            nic,
            appointment_date,
            department,
            doctor: {
                firstName: doctor_firstName,
                lastName: doctor_lastName,

            },
            hasVisited,
            address,
            patientId,
            doctorId


        });

        console.log("APPOINTMENT ", appointment);

        return res.status(200).json({
            success: true,
            message: "Appointment sent Successfully !"
        })

    } catch (error) {
        // console.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occur while Patient taking appointment"
        });

    }

}


exports.getAllAppointment = async (req, res, next) => {
    try {
        const appointments = await Appointment.find();
        return res.status(200).json({
            success: true,
            appointments,
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occur while getting all appointment"
        });
    }
}

exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        let appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        appointment = await Appointment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        console.log("APPOINTMENT : ", appointment);


        return res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occur while updating appointment status"
        });

    }
}

exports.deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        let appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        await appointment.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Appointment delete successfully",
            appointment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occur while deleting appointment status"
        });

    }
}

exports.totalAppointment = async (req, res, next) => {
    try {

        const total = await Appointment.countDocuments();
        return res.status(200).json({
            success: true,
            message: "Appointments Count Successfully",
            total,
        });


    } catch (error) {
        console.log("some error occur while counting total appointment");
        return res.status(500).json({
            success: false,
            message: "Some error occur while deleting appointment status"
        });
    }
}

