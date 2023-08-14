const express = require('express');
const router = express.Router();
const controller = require('../controllers/staff_controllers');

router.route('/login').post(controller.Login)

router.route('/logout').post(controller.Logout)

router.route('/usr').get(controller.ShowUserInfo)
                    .post(controller.UpdateUserInfo)

module.exports = router;