const express = require('express');
const router = express.Router();
const account_controller = require('../controllers/admin_controllers');

router.route('/staff')
        .get(account_controller.ShowStaff)
        .post(account_controller.CreateUser)
        .put(account_controller.SearchUser)

router.route('/staff/:id')
        .get(account_controller.ShowUserInfo)
        .post(account_controller.ResetPass)
        .put(account_controller.UpdateUser)

module.exports = router;