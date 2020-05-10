const multer = require('multer');
const path = require('path');

const MIME_TYPE_MAP = {

  // mimeTypes from the official : https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

  // image types
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  // ms word doc mime types
  'application/msword': 'doc',
  'application/x-abiword': 'abw',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/pdf': 'pdf',
  // audio
  'audio/mpeg': 'mp3',
  //video
  'video/mp4': 'mp4',
  'video/x-ms-wmv': 'wmv', //windows media
  'video/x-msvideo' : 'avi', //A/V interleave
  'video/quicktime': 'mov', //QuickTime
  'video/x-flv': 'flv' // flash

 };

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    // const isValid = MIME_TYPE_MAP[file.mimetype];
    // let error = new Error('invalid mime type on Server!!');
    // if (isValid) {
    //   error = null;
    // }
    cb(null, 'backend/uploads')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    // let extArray = file.mimetype.split("/");
    // let extension = extArray[extArray.length - 1];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



module.exports = multer({ storage: storage }).single('upload')
