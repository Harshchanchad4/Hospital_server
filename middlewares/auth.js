const User = require("../Models/User");
const jwt = require("jsonwebtoken");

exports.isAdmin = async (req , res , next) => {

    // authentication
    const token = req.cookies.adminToken;
    if(!token)
    {
        return res.status(400).json({
            success : false,
            message : "Admin not Authenticated",
        });

    }
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    

    // authorization
    if(req.user.role !== "Admin")
    {
        return res.status(403).json({
            success : false,
            message : `${req.user.role} is not authorized for this resources`
        });
    }
    next();

}

exports.isPatient = async (req , res , next) => {

    const token = req.cookies.patientToken;
    if(!token)
    {
        return res.status(400).json({
            success : false,
            message : "Patient not Authenticated",
        });

    }
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if(req.user.role !== "Patient")
    {
        return res.status(403).json({
            success : false,
            message : `${req.user.role} is not authorized for this resources`
        });
    }

    next();
}