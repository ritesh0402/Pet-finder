//Config File for Cloudinary
//From multer-storage-cloudinary docs

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: "dh6doawfe",
    api_key: "524257564362236",
    api_secret: "VnY5UYIWbnYNRD63gKLPMdpSfGk"
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Pets',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}