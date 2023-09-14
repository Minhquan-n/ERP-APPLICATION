const Admin_account_services = require('../services/admin/admin_services_accounts');
const Staff_account_services = require('../services/staff/staff_services_accounts');
const ApiErr = require('../api-error');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Tao tai khoan nhan vien moi
exports.CreateUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    if (!req.body.sdt) return next(new ApiErr(400, 'Empty phone number'));
    else if (!req.body.hoten) return next(new ApiErr(400, 'Empty user name'));
    try {
        const phoneCheck = await Staff_account_services.verify_phone(req.body.sdt);
        const emailCheck = await Staff_account_services.verify_email(req.body.email);
        if (phoneCheck) return next (new ApiErr(400, 'Phone number existed'));
        else {
            if (emailCheck) return next (new ApiErr(400, 'Email number existed'));
            else {
                bcrypt.hash('12345678', 10, async (err, hash) => {
                    if (!err) {
                        const staffamount = await Admin_account_services.getStaffAmount();
                        const newAmount = staffamount + 1;
                        const msnv = 'MNV0' + staffamount;
                        const workinghours = await Staff_account_services.getWorkingHours(req.body.loaihinhcongviec);
                        const salaryOn1H = (req.body.luongcoban / workinghours);
                        const payload = {
                            msnv: msnv,
                            sdt: req.body.sdt,
                            email: req.body.email,
                            matkhau: hash,
                            hoten: req.body.hoten,
                            ngaybatdau: req.body.ngaykyhopdong,
                            sohdld: req.body.sohdld,
                            ngaykyhopdong: req.body.ngaykyhopdong,
                            loaihopdong: req.body.loaihopdong,
                            luongcoban: req.body.luongcoban,
                            luongcoban1h: salaryOn1H,
                            loaihinhcongviec: req.body.loaihinhcongviec,
                            chinhanh: req.body.chinhanh,
                            bophan: req.body.bophan,
                            chucvu: req.body.chucvu,
                            avt_secure_url: process.env.AVT_SECURE_URL,
                            avt_public_id: process.env.AVT_PUBLIC_ID,
                            avt_format: process.env.AVT_FORMAT
                        }
                        const newUsr = await Admin_account_services.createUser(payload);
                        if (newUsr.msnv === payload.msnv && newUsr.hoten === payload.hoten) {
                            const updateStaffAmount = await Admin_account_services.updateStaffAmount(newAmount);
                            if (updateStaffAmount === 'Success') res.send(newUsr);
                        }
                    }
                })
            }
        }
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
        const workinghours = await Staff_account_services.getWorkingHours(req.body.loaihinhcongviec);
        const salaryOn1H = (req.body.luongcoban / workinghours);
        const payload = {
            soBHXH: req.body.soBHXH,
            soBHYT: req.body.soBHYT,
            noidkkcb: req.body.noidkkcb,
            tyledongbaohiem: req.body.tyledongbaohiem,
            luongcoban: req.body.luongcoban,
            luongcoban1h: salaryOn1H,
            phepnam: req.body.phepnam,
            loaihinhcongviec: req.body.loaihinhcongviec,
            sohdld: req.body.sohdld,
            ngaykyhopdong: req.body.ngaykyhopdong,
            loaihopdong: req.body.loaihopdong,
            id_chinhanh: req.body.chinhanh,
            id_bophan: req.body.bophan,
            id_chucvu: req.body.chucvu,
            ngaybatdaulamviec: req.body.ngaybatdaulamviec
        }
        const oldLaborContract = await Staff_account_services.getUserLaborContract(req.params.id);
        const oldoffice = await Staff_account_services.getUserOffice(req.params.id);
        const oldarea = await Staff_account_services.getUserArea(req.params.id);
        const oldPosition = await Staff_account_services.getUserPosition(req.params.id);
        if (payload.sohdld !== oldLaborContract.sohdld) {
            const laborcontract = await Admin_account_services.updateUserLaborContract(req.params.id, payload);
            if (laborcontract !== 'Success') return next(new ApiErr(500, "An error orcurred while update labor contract."));
        }
        if (payload.id_chinhanh !== oldoffice.id_chinhanh) {
            const office = await Admin_account_services.updateUserOffice(req.params.id, payload);
            if (office !== 'Succes') return next(new ApiErr(500, "An error orcurred while update office."));
        }
        if (payload.id_bophan !== oldarea.id_bophan) {
            const area = await Admin_account_services.updateUserArea(req.params.id, payload);
            if (area !== 'Succes') return next(new ApiErr(500, "An error orcurred while update depatment."));
        }
        if (payload.id_chucvu !== oldPosition.id_chucvu) {
            const position = await Admin_account_services.updateUserPosition(req.params.id, payload);
            if (position !== 'Succes') return next(new ApiErr(500, "An error orcurred while update position."));
        }
        const result_workinfo = await Admin_account_services.updateUserWorkInfo(req.params.id, payload);
        if (result_workinfo === 'Success') res.send('Update success.');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while update user.'));}
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

// Khoa tai khoan nhan vien
exports.DisableUser = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    if (!req.body.msnv) return next(new ApiErr(400, "Empty user id"));
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while disable user.'));}
}

// Reset mat khau tai khoan cho nhan vien
exports.ResetPass = async (req, res, next) => {
    if (!req.cookies.position || req.cookies.position !== '1') return next(new ApiErr(401, 'You do not have permission to access.'));
    try {
        bcrypt.hash('12345678', 10, async (err, hash) => {
            if (!err) {
                const reset = await Admin_account_services.resetPass(req.params.id, hash);
                if (reset === 'Success') res.send(reset);
            }
        }) 
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while disable user.'));}
}

// Tao bang cham cong moi
exports.CreateTimesheet = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while create timesheet.'));}
}

// Hien thi bang cham cong
exports.ShowTimesheet = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while show timesheet.'));}
}

// Tao bang luong cho tung nhan vien
exports.CreatePaySheet = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while create pay sheets.'));}
}

// Hien thi bang luong tat ca nhan vien trong thang
exports.ShowPaySheets = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while show pay sheets.'));}
}
