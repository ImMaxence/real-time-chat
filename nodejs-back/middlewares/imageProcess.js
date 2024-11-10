const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const imageBuffer = await sharp(req.file.buffer)
            .resize(400, 400)
            .jpeg({ quality: 100 })
            .rotate() // EXFIX
            .toBuffer();

        const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        req.body.image = imageBase64;

        next();
    } catch (error) {
        console.log("🎨 - Error during image processing : ", error);
        return res.status(500).json({ message: '❌ - Error during image processing' });
    }
};

module.exports = { upload, resizeImage };
