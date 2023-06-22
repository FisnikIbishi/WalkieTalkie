const express = require('express');
var userController = require('../controllers/userController.js');
const router = express.Router();

router.get('/diseases', userController.getDiseases);
router.post('/disease', userController.addDisease);
router.post('/disease/delete/:diseaseId', userController.deleteDisease);
router.post('/subdisease', userController.addSubDisease);
router.get('/disease/:id', userController.getDisease);
router.post('/disease/:id', userController.editDisease);


module.exports = router;