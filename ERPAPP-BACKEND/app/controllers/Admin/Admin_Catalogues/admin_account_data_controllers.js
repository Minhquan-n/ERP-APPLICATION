const Datalogues_Service  = require('../../../services/Admin/Admin_Catalogues/admin_account_data_services');
const ApiErr = require('../../../api-error');
require('dotenv').config();

// Lay danh sach dan toc
exports.GetEthnicList = async(req, res, next) => {
    try {
        const list = await Datalogues_Service.getEthnic();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load ethnic list.'))};
}

// Lay danh sach tinh thanh
exports.GetProvinceList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getProvinceList();
        res.send(list);
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while load province list.'));
    }
}

// Lay danh sach quan huyen
exports.GetDistrictList = async (req, res, next) => {
    if (!req.body.id_tinhthanh) return next(new ApiErr(400, 'Empty province code.'));
    try {
        const list = await Datalogues_Service.getDistrictList(req.body.id_tinhthanh);
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load district list.'))};
}

// Lay danh sach phuong xa
exports.GetWardList = async (req, res, next) => {
    if (!req.body.id_tinhthanh || req.body.id_quanhuyen) return next(new ApiErr(400, 'Empty province code or district code.'));
    try {
        const list = await Datalogues_Service.getWardList(req.body.id_tinhthanh, req.body.id_quanhuyen);
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load ward list.'))};
}

// Lay danh sach chi nhanh
exports.GetBranchList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getBranchList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load branch list.'))};
}

// Them chi nhanh
exports.AddBranch = async (req, res, next) => {
    if (req.body.id || !req.body.tenchinhanh || !req.body.sonha || !req.body.tinhthanh || !req.body.quanhuyen || !req.body.phuongxa) 
        return next(new ApiErr(400, 'Empty information to add new branch'));
    try {
        const add = await Datalogues_Service.addBranch(req.body);
        if (!add) throw new Error('Fail');
        const branchamount = await Datalogues_Service.getBranchAmount();
        if (!branchamount) throw new Error('Fail to get branch amout.');
        const update = await Datalogues_Service.updateBranchAmount(branchamount);
        if (!update) throw new Error('Fail to update branch amount.');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while add new branch.'))};
}

// Cap nhat chi nhanh
exports.UpdateBranch = async (req, res, next) => {
    if (!req.body.id) return next(new ApiErr(400, 'Empty branch id.'));
    try {
        const update = await Datalogues_Service.updateBranch(req.body.id, req.body);
        if (!update) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while update branch.'))};
}

// Tim kiem chi nhanh
exports.SearchBranch = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(400, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchBranch(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while search branch.'))};
}

// Lay danh sach bo phan
exports.GetDepartmentList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getDepartmentList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load department list.'))};
}

// Them bo phan
exports.AddDepartment = async (req, res, next) => {
    if (req.body.id || !req.body.tenbophan) return next(new ApiErr(400, 'Empty name of department.'));
    try {
        const add = await Datalogues_Service.addDepartment(req.body.tenbophan);
        if (!add) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while add new department'))};
}

// Cap nhat bo phan
exports.UpdateDepartment = async (req, res, next) => {
    if (!req.body.id) return next(new ApiErr(400, 'Empty department id.'));
    try {
        const update = await Datalogues_Service.updateDepartment(req.body.id, req.body.tenbophan);
        if (!update) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while update department.'))};
}

// Tim kiem bo phan
exports.SearchDepartment = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(400, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchDepartment(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while search area.'))};
}

// Lay danh sach chuc vu
exports.GetPositionList = async (req, res, next) => {
    try {
        const list = await Datalogues_Service.getPositionList();
        res.send(list);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load positon list.'))};
}

// Them chuc vu
exports.AddPosition = async (req, res, next) => {
    if (req.body.if || !req.body.tenchucvu) return next(new ApiErr(400, 'Empty name of position.'));
    try {
        const add = await Datalogues_Service.addPosition(req.body.tenchucvu);
        if (!add) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500), 'An error occurred while add new position.')};
}

// Cap nhat chuc vu
exports.UpdatePosition = async (req, res, next) => {
    if (!req.body.id) return next(new ApiErr(400, 'Epmty position id.'));
    try {
        const update = await Datalogues_Service.updatePosition(req.body.id, req.body.tenchucvu);
        if (!update) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while update position.'))};
}

// Tim kiem chuc vu
exports.SearchPosition = async (req, res, next) => {
    if (!req.body.key) return next(new ApiErr(400, 'Empty key.'));
    try {
        const list = await Datalogues_Service.searchPosition(req.body.key);
        list.length !== 0 ? res.send(list) : res.send('No result');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while search position.'))};
}