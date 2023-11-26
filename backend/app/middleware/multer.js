const multer = require('multer');
const path = require('path');

const uploadFolderPath = path.join(__dirname, '../../../frontend/client/public/images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const username = req.body.username;
    const newFilename = `${username}profilePicture${extname}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
