const express = require('express');
const router = express.Router();
const staff_datalogues = require('../../controllers/admin/admin_account_data_controllers');

router.route('/data/ethniclist').get(staff_datalogues.GetEthnicList)

router.route('/data/provincelist').get(staff_datalogues.GetProvinceList)

router.route('/data/districtlist').get(staff_datalogues.GetDistrictList)

router.route('/data/wardlist').get(staff_datalogues.GetWardList)

router.route('/data/branch')
        .get(staff_datalogues.GetBranchList)
        .put(staff_datalogues.SearchBranch)

router.route('/data/department')
        .get(staff_datalogues.GetDepartmentList)
        .put(staff_datalogues.SearchDepartment)

router.route('/data/position')
        .get(staff_datalogues.GetPositionList)
        .put(staff_datalogues.SearchPosition)

module.exports = router;