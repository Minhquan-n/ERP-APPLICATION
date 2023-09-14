const Datalogues_Service  = require('../services/app_services/staff_datalogues_services');
const ApiErr = require('../api-error');
require('dotenv').config();

// Lay danh sach dan toc
exports.GetEthnicList = async(req, res, next) => {
    try {
        const list = await Datalogues_Service.getEthnic();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load ethnic list.'))};
}

// Lay danh sach tinh thanh
exports.GetProvinceList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getProvinceList();
        res.send(list);
    } catch (err) {
        return next(new ApiErr(500, 'An error orcurred while load province list.'));
    }
}

// Lay danh sach quan huyen
exports.GetDistrictList = async (req, res, next) => {
    if (!req.body.id_tinhthanh) return next(new ApiErr(401, 'Empty province code.'));
    try {
        const list = await Datalogues_Service.getDistrictList(req.body.id_tinhthanh);
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load district list.'))};
}

// Lay danh sach phuong xa
exports.GetWardList = async (req, res, next) => {
    if (!req.body.id_tinhthanh || req.body.id_quanhuyen) return next(new ApiErr(401, 'Empty province code or district code.'));
    try {
        const list = await Datalogues_Service.getWardList(req.body.id_tinhthanh, req.body.id_quanhuyen);
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load ward list.'))};
}

// Lay danh sach chi nhanh
exports.GetOfficeList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getOfficeList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load office list.'))};
}

// Tim kiem chi nhanh
exports.SearchOffice = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(401, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchOffice(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while search office.'))};
}

// Lay danh sach bo phan
exports.GetAreaList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getAreaList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load area list.'))};
}

// Tim kiem bo phan
exports.SearchArea = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(401, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchArea(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while search area.'))};
}

// Lay danh sach chuc vu
exports.GetPositionList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getPositionList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load positon list.'))};
}

// Tim kiem chuc vu
exports.SearchPosition = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(401, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchPosition(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while search position.'))};
}