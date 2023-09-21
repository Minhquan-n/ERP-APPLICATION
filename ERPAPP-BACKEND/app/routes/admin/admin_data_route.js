const express = require('express');
const router = express.Router();
const staff_datalogues = require('../../controllers/admin/admin_account_data_controllers');

router.route('/data/ethniclist').get(staff_datalogues.GetEthnicList)

router.route('/data/provincelist').get(staff_datalogues.GetProvinceList)

router.route('/data/districtlist').get(staff_datalogues.GetDistrictList)

router.route('/data/wardlist').get(staff_datalogues.GetWardList)

router.route('/data/branch')
        .get(staff_datalogues.GetBranchList)
        .post(staff_datalogues.AddBranch)
        .put(staff_datalogues.UpdateBranch)
        .patch(staff_datalogues.SearchBranch)

router.route('/data/department')
        .get(staff_datalogues.GetDepartmentList)
        .post(staff_datalogues.AddDepartment)
        .put(staff_datalogues.UpdateDepartment)
        .patch(staff_datalogues.SearchDepartment)

router.route('/data/position')
        .get(staff_datalogues.GetPositionList)
        .post(staff_datalogues.AddPosition)
        .put(staff_datalogues.UpdatePosition)
        .patch(staff_datalogues.SearchPosition)

module.exports = router;