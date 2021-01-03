const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const personValid = require('../middleware/checkPersonValid');
const multer = require('multer');

//handling with upload image (on createMerchant)
const storage = multer.diskStorage({
    //destination to upload
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    //filename destination
    filename: function (req, file, cb) {
        let date = new Date();
        //time to milliseconds  
        date = date.getTime();
        //auxiliary variable to save changes when replace SPACES with "-" 
        let auxFileName = file.originalname.replace(/[^A-Z0-9]+/ig, "-");

        //check type file to add type on the file
        switch (file.mimetype) {
            case 'image/png':
                auxFileName = auxFileName + '.png';
                break;
            case 'image/jpeg':
                auxFileName = auxFileName + '.jpeg';
                break;
            case 'image/jpg':
                auxFileName = auxFileName + '.jpg';
                break;
            default:
                break;
        }
        cb(null, date + '-' + auxFileName);
    }
});
//filtering types of upload (only accept jpeg, jpg and png)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        //only accepting 2MB
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});

router.get('/', userController.getUsers);

router.put('/changeEP/:id', personValid, userController.changeEmailPassword);

router.get('/infoUser/:id', personValid, userController.getInfoUser);

router.put('/changeInfo/:id', personValid, userController.changeInfo);

router.put('/changeInfoAd/:id', personValid, userController.changeInfoAd);

router.put('/changeLogoMe/:id', personValid, upload.single('logo'), userController.changeLogoMe);

module.exports = router;
