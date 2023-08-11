const express = require('express');
const router = express.Router();
const controller = require('../controllers/staff_controllers');

router.route('/login').post(controller.Login)

router.route('/logout').post(controller.Logout)

module.exports = router;