const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utills/jwtToken");
const cloudinary = require("cloudinary").v2;
const { uploadImageToCloudinary } = require("../utills/imageUploader");
require('dotenv').config();


exports.patientRegister = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;

    if(role === "Admin" || role === "Doctor")
    {
        return res.status(400).json({
            success: false,
            message : "you can not registered with this role",
        })
    }

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role
    ) {
        return res.status(400).json({
            success: false,
            message: "Plase fill full form !"
        })
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User Already registered"
        });
    }
    await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role
    });

    res.status(200).json({
        success: true,
        message: "User Registered",
    });



}

exports.login = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all details',
        });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        console.log("uSER" , user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User with this email does not exist",
            });
        }

        if (role !== user.role) {
            return res.status(401).json({
                success: false,
                message: "User with this role does not exist",
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        
        console.log("ISPASSWORDMATCH " , isPasswordMatch);
        if (!isPasswordMatch) {
            console.log("Password not matched:", password, user.password); // Log the passwords for debugging
            return res.status(401).json({
                success: false,
                message: "Password not matched",
            });
        }

        generateToken(user, "User logged in successfully", 200, res);
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};


exports.addNewAdmin = async (req, res) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    console.log("ADMIN:", req.body);

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return res.status(400).json({
            success: false,
            message: "Please fill the complete form"
        });
    }

    try {
        const isRegistered = await User.findOne({ email });

        if (isRegistered) {
            return res.status(400).json({
                success: false,
                message: `${isRegistered.role} with this email already exists`
            });
        }

        const admin = await User.create({
            firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin",
        });

        return res.status(201).json({
            success: true,
            message: "New admin registered successfully"
        });
    } catch (error) {
        console.error("Error registering new admin:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

exports.getAllDoctors = async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    console.log("DOCTOR  ", doctors);
    return res.status(200).json({
        success: true,
        doctors,
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
}

exports.logoutAdmin = async (req, res, next) => {

    res.status(200).cookie("adminToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "User Log out successfully",
    });
}
exports.logoutPatient = async (req, res, next) => {

    res.status(200).cookie("patientToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "User Log out successfully",
    });
}



exports.addNewDoctor = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Doctor Avatar Required"
      });
    }

    const { docAvatar } = req.files;
    const allowedFormat = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormat.includes(docAvatar.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "File Format not supported"
      });
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
      return res.status(400).json({
        success: false,
        message: "Please provide full details"
      });
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: `${req.user.role} already registered with this email`
      });
    }
    console.log("DOCAVATAR  " , docAvatar);

    const cloudinaryResponse = await uploadImageToCloudinary(docAvatar, 'coursefolder');

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
      return res.status(500).json({
        success: false,
        message: "Error uploading to Cloudinary"
      });
    }

    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      doctorDepartment,
      role: "Doctor",
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "New Doctor Registered",
      doctor
    });
  } catch (error) {
    console.error("Error registering new doctor:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the doctor"
    });
  }
};
exports.totalDoctors = async (req, res, next) => {
    try {
        const total = await User.find({ role: "Doctor" });
        console.log("DOCTORS: ", total);

        const doctorCount = total.length;
        console.log("Doctor Count: ", doctorCount);

        return res.status(200).json({
            success: true,
            message: "Doctors Count Successfully",
            doctorCount,
        });
    } catch (error) {
        console.log("Some error occurred while counting total doctors");
        return res.status(500).json({
            success: false,
            message: "Some error occurred while counting doctors"
        });
    }
}
