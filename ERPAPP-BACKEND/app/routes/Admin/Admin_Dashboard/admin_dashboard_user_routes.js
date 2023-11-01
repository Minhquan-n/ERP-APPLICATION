const express = require('express');
const router = express.Router();
const admin_user_dashboard = require('../../../controllers/Admin/Admin_Dashboard/admin_dashboard_user_controllers');

router.route('/dashboard/overview')
    .get(admin_user_dashboard.Overview)
    .put(admin_user_dashboard.GetAverageOT)

// router.route('/dashboard/overtime').get(admin_user_dashboard.GetAverageOT)

module.exports = router;