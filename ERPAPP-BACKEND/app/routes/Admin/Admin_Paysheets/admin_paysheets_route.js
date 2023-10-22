const express = require('express');
const router = express.Router();

const controllers = require('../../../controllers/Admin/Admin_Paysheets/admin_paysheets_controllers');

router.route('/admin/timesheet')
        .get(controllers.ShowTimesheet)
        .post(controllers.CreateTimesheet)
        .put(controllers.Timekeeping)
router.route('/admin/paysheet')
        .get(controllers.ShowPaysheets)
        .post(controllers.CreatePaysheet)
        .put(controllers.UpdatePaySheet)
router.route('/data/paysheetlist')
        .get(controllers.GetPaysheetList)

module.exports = router;