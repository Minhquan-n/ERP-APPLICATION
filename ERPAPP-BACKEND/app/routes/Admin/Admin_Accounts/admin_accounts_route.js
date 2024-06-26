const express = require('express');
const router = express.Router();
const account_controller = require('../../../controllers/Admin/Admin_Accounts/admin_account_controllers');

router.route('/usr')
        .get(account_controller.ShowStaff)
        .post(account_controller.CreateUser)
        .put(account_controller.SearchUser)

router.route('/usr/:id')
        .get(account_controller.ShowUserInfo)
        .post(account_controller.ResetPass)
        .put(account_controller.UpdateUser)
        .patch(account_controller.EnableUser)
        .delete(account_controller.DisableUser)

module.exports = router;