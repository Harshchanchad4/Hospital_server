const cloudinary = require("cloudinary").v2;                         //! Cloudinary is being required
require('dotenv').config();


console.log("Cloud :" ,process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY :" ,process.env.CLOUDINARY_API_KEY);
console.log("API_SeCRET :" ,process.env.CLOUDINARY_API_SECRET);

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({                                       	// Configuring the Cloudinary to Upload MEDIA 
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	} catch (error) {
		console.log(error);
	}
};