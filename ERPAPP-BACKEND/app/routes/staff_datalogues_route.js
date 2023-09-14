const express = require('express');
const router = express.Router();
const staff_datalogues = require('../controllers/staff_datalogues_controllers');

router.route('/data/ethniclist').get(staff_datalogues.GetEthnicList)

router.route('/data/provincelist').get(staff_datalogues.GetProvinceList)

router.route('/data/districtlist').get(staff_datalogues.GetDistrictList)

router.route('/data/wardlist').get(staff_datalogues.GetWardList)

router.route('/data/office')
        .get(staff_datalogues.GetOfficeList)
        .put(staff_datalogues.SearchOffice)

router.route('/data/area')
        .get(staff_datalogues.GetAreaList)
        .put(staff_datalogues.SearchArea)

router.route('/data/position')
        .get(staff_datalogues.GetPositionList)
        .put(staff_datalogues.SearchPosition)

module.exports = router;