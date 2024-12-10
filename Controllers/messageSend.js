const Message = require("../Models/messageSchema");
const { ErrorHandler } = require("../middlewares/errorMiddleware")

exports.sendMessage = async (req, res, next) => {

    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName && !lastName || !email || !phone || !message) {
        return res.status(400).json({

            success: false,
            message: "plase fill up full form",
        })
    }
    await Message.create({
        firstName,
        lastName,
        email,
        phone,
        message
    })

    return res.status(200).json({
        success: true,
        message: "message send successfully",
    })

}

exports.getAllMessages = async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
};