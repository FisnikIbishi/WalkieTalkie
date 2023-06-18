const express = require('express');
const multer = require('multer')
const router = express.Router();
const path = require('path');
const authorize = require('../middlewares/authorize');
var homeController = require('../controllers/homeController.js');
var userController = require('../controllers/userController.js');

router.get('/', authorize(), homeController.home);
router.get('/api/friendRequests', authorize(), userController.getFriendRequests);
router.post('/api/friendRequests/accept', authorize(), userController.acceptFriend);
router.post('/api/friendRequests/reject', authorize(), userController.rejectFriend);
router.post('/api/users/current', authorize(), userController.currentUser);
router.get('/api/users/:username', authorize(), userController.getUsers);
router.post('/api/users', authorize(), userController.addFriend);
router.get('/api/logout', authorize(), userController.logOut);

// Image Upload
const imageStorage = multer.diskStorage({
    destination: 'public/images', // Destination to store image 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})


// For Single image upload
router.post('/api/uploadAvatar', imageUpload.single('image'), userController.saveAvatar);

module.exports = router;