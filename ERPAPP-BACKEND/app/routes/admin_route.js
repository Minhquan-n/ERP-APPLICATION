const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin_controllers');

router.route('/staff')
        .get(controller.ShowStaff)
        .post(controller.CreateUser)

router.route('/staff/:id')
        .get(controller.ShowUserInfo)
        .post(controller.UpdateUser)

module.exports = router;