const express = require('express');
const router = express.Router();
const admin_user_dashboard = require('../../../controllers/Admin/Admin_Dashboard/admin_dashboard_user_controllers');

router.route('/dashboard/overview').get(admin_user_dashboard.Overview)

router.route('/dashboard/avgot').get(admin_user_dashboard.GetAverageOT)

router.route('/dashboard/avgoff').get(admin_user_dashboard.GetAverageOff)

module.exports = router;