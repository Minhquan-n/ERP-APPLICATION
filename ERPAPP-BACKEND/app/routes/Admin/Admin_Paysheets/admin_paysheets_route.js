const express = require('express');
const router = express.Router();

const controllers = require('../../../controllers/Admin/Admin_Paysheets/admin_paysheets_controllers');

router.route('/admin/timesheet')
        .patch(controllers.ShowTimesheet)
        .post(controllers.CreateTimesheet)
        .put(controllers.Timekeeping)
router.route('/admin/paysheet')
        .patch(controllers.ShowPaysheets)
        .post(controllers.CreatePaysheet)
        .put(controllers.UpdatePaySheet)
router.route('/data/paysheetlist')
        .get(controllers.GetPaysheetList)
        .post(controllers.BlockPaysheet)

module.exports = router;