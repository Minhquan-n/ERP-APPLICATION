const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/User/User_accounts/user_account_controllers');

router.route('/login').post(controller.Login)

router.route('/logout').post(controller.Logout)

router.route('/profile').get(controller.ShowUserInfo)
                    .post(controller.ChangePassword)
                    .put(controller.UpdateUserInfo)

router.route('/timesheet').put(controller.ShowTimesheet)

router.route('/paysheet').put(controller.ShowPaysheet)

module.exports = router;