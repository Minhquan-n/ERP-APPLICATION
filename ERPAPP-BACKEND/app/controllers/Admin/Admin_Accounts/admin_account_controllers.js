const Admin_account_services = require('../../../services/Admin/Admin_Accounts/admin_account_services');
const Staff_account_services = require('../../../services/User/User_Accounts/user_account_services');
const ApiErr = require('../../../api-error');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Tao tai khoan nhan vien moi
exports.CreateUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    if (!req.body.sdt) return next(new ApiErr(400, 'Empty phone number'));
    if (!req.body.hoten) return next(new ApiErr(400, 'Empty user name'));
    try {
        // Kiem tra ton tai cua sdt va email
        const phoneCheck = await Staff_account_services.verify_phone(req.body.sdt);
        const emailCheck = await Staff_account_services.verify_email(req.body.email);
        if (phoneCheck) return next (new ApiErr(400, 'Phone number existed'));
        if (emailCheck) return next (new ApiErr(400, 'Email number existed'));
        bcrypt.hash('12345678', 10, async (err, hash) => {
            if (!err) {
                const staffamount = await Admin_account_services.getStaffAmount();
                const newAmount = staffamount + 1;
                const msnv = 'MNV0' + staffamount;
                const newUsr = await Admin_account_services.createUser(msnv, hash, req.body);
                if (newUsr === 'Fail') {
                    throw new Error('Fail');
                }
                const updateStaffAmount = await Admin_account_services.updateStaffAmount(newAmount);
                if (updateStaffAmount === 'Success') res.send(newUsr);
            }
        })
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while create new user.'));}
}

// Hien thi thong tin nhan vien
exports.ShowUserInfo = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        const acc = await Staff_account_services.getUserAccountInfo(req.params.id);
        const usr_info = await Staff_account_services.getUserPersonalInfo(req.params.id);
        const work_info = await Staff_account_services.getUserWorkInfo(req.params.id);
        const laborcontract_info = await Staff_account_services.getUserLaborContract(req.params.id);
        const office_info = await Staff_account_services.getUserOffice(req.params.id);
        const area_info = await Staff_account_services.getUserArea(req.params.id);
        const position_info = await Staff_account_services.getUserPosition(req.params.id);
        const avt = await Staff_account_services.getUserAvt(req.params.id);
        const user = Object.assign(acc, usr_info, work_info, laborcontract_info, office_info, area_info, position_info, avt);
        const ngaybatdau = new Date (`${user.ngaybatdau} UTC+0`);
        const ngaykyhopdong = new Date(`${user.ngaykyhopdong} UTC+0`);
        user.ngaybatdau = ngaybatdau.toLocaleDateString('en-GB');
        user.ngaykyhopdong = ngaykyhopdong.toLocaleDateString('en-GB');
        res.send(user);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Cap nhat thong tin cong viec cho nhan vien
exports.UpdateUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        const oldLaborContract = await Staff_account_services.getUserLaborContract(req.params.id);
        const oldBranch = await Staff_account_services.getUserOffice(req.params.id);
        const oldArea = await Staff_account_services.getUserArea(req.params.id);
        const oldPosition = await Staff_account_services.getUserPosition(req.params.id);
        if (req.body.sohdld !== oldLaborContract.sohdld) {
            const laborcontract = await Admin_account_services.updateUserLaborContract(req.params.id, req.body);
            if (!laborcontract) throw new Error('Fail to update labor contract.');
        }
        if (req.body.chinhanh !== oldBranch.id_chinhanh) {
            const laborcontract = await Admin_account_services.updateUserBranch(req.params.id, req.body);
            if (!laborcontract) throw new Error('Fail to update branch.');
        }
        if (req.body.bophan !== oldArea.id_bophan) {
            const laborcontract = await Admin_account_services.updateUserDepartment(req.params.id, req.body);
            if (!laborcontract) throw new Error('Fail to update department.');
        }
        if (req.body.chucvu !== oldPosition.id_chucvu) {
            const laborcontract = await Admin_account_services.updateUserPosition(req.params.id, req.body);
            if (!laborcontract) throw new Error('Fail to update position.');
        }
        const update_workInfo = await Admin_account_services.updateUserWorkInfo(req.params.id, req.body);
        if (!update_workInfo) throw new Error('Fail to update work information.');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, err));}
}

// Hien thi danh sach nhan vien
exports.ShowStaff = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        const staff = await Admin_account_services.getUserList();
        res.send(staff);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Tim kiem nhan vien theo tu khoa
exports.SearchUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    if (!req.body.key) return next(new ApiErr(400, "Empty key"));
    try {
        const key = req.body.key;
        const msnv = (key.substr(0, 4)).toUpperCase();
        if (msnv === 'MNV') {
            const key_search = `tk.msnv = '${key}'`
            const list = await Admin_account_services.getSearch(key_search);
            list.length !== 0 ? res.send(list) : res.send('No result.');
        }
        const key_search = `ttcn.hoten LIKE '%${key}%'`
        const list = await Admin_account_services.getSearch(key_search);
        if (list.length !== 0) res.send(list);
        else res.send('No result.');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while search user.'));}
}

// Reset mat khau tai khoan
exports.ResetPass = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        bcrypt.hash('12345678', 10, async (err, hash) => {
            if (!err) {
                const reset = await Admin_account_services.resetPass(req.params.id, hash);
                if (!reset) throw new Error('Fail');
                res.send('Success');
            }
        }) 
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while disable user.'));}
}

// Vo hieu hoa tai khoan
exports.DisableUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        const disable = await Admin_account_services.disableUser(req.params.id);
        if (!disable) throw new Error('Fail');
        res.send('Success');
    } catch (err) { return next(new ApiErr(500, 'An error orcurred while disable user.'));}
}

// Kich hoat tai khoan nguoi dung
exports.EnableUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        const enable = await Admin_account_services.enableUser(req.params.id);
        if (!enable) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while enable user.'))};
}
