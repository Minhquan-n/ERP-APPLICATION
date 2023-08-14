const Admin_services = require('../services/admin/admin_services');
const Staff_services = require('../services/staff/staff_services');
const ApiErr = require('../api-error');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Tao tai khoan nhan vien moi
exports.CreateUser = async (req, res, next) => {
    if (!req.body) return next(new ApiErr(400, 'Please provide user information.'));
    else if (!req.body.hoten) return next(new ApiErr(400, 'Please provide user fullname'));
    try {
        const phoneCheck = await Staff_services.verify_phone(req.body.sdt);
        const emailCheck = await Staff_services.verify_email(req.body.email);
        if (phoneCheck) return next (new ApiErr(400, 'Phone number existed'));
        else {
            if (emailCheck) return next (new ApiErr(400, 'Email number existed'));
            else {
                bcrypt.hash('12345678', 10, async (err, hash) => {
                    if (!err) {
                        const staffamount = await Admin_services.getStaffAmount();
                        const newAmount = staffamount + 1;
                        const msnv = 'NV0' + newAmount;
                        const workinghours = await Staff_services.getWorkingHours(req.body.loaihinhcongviec);
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
                        const newUsr = await Admin_services.createUser(payload);
                        if (newUsr.msnv === payload.msnv && newUsr.hoten === payload.hoten) {
                            const updateStaffAmount = await Admin_services.updateStaffAmount(newAmount);
                            if (updateStaffAmount === 'Success') res.send(`${newUsr.hoten}`);
                        }
                    }
                })
            }
        }
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while create new user.'));}
}

// Hien thi thong tin nguoi dung
exports.ShowUserInfo = async (req, res, next) => {
    try {
        const acc = await Admin_services.getUserAccountInfo(req.params.id);
        const usr_info = await Admin_services.getUserPersonalInfo(req.params.id);
        const work_info = await Admin_services.getUserWorkInfo(req.params.id);
        const laborcontract_info = await Admin_services.getUserLaborContract(req.params.id);
        const agency_info = await Admin_services.getUserAgency(req.params.id);
        const department_info = await Admin_services.getUserDepartment(req.params.id);
        const position_info = await Admin_services.getUserPosition(req.params.id);
        const user = Object.assign(acc, usr_info, work_info, laborcontract_info, agency_info, department_info, position_info);
        const ngaybatdau = new Date (`${user.ngaybatdau} UTC+0`);
        const ngaykyhopdong = new Date(`${user.ngaykyhopdong} UTC+0`);
        user.ngaybatdau = ngaybatdau.toLocaleDateString('en-GB');
        user.ngaykyhopdong = ngaykyhopdong.toLocaleDateString('en-GB');
        res.send(user);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Cap nhat thong tin cong viec cho nhan vien
exports.UpdateUser = async (req, res, next) => {
    if (!req.body) return next(new ApiErr(400, 'Please provide user information to update.'));
    try {
        const workinghours = await Staff_services.getWorkingHours(req.body.loaihinhcongviec);
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
        const oldLaborContract = await Admin_services.getUserLaborContract(req.params.id);
        const oldAgency = await Admin_services.getUserAgency(req.params.id);
        const oldDepartment = await Admin_services.getUserDepartment(req.params.id);
        const oldPosition = await Admin_services.getUserPosition(req.params.id);
        if (payload.sohdld !== oldLaborContract.sohdld) {
            const laborcontract = await Admin_services.updateUserLaborContract(req.params.id, payload);
            if (laborcontract !== 'Success') return next(new ApiErr(500, "An error orcurred while update labor contract."));
        }
        if (payload.id_chinhanh !== oldAgency.id_chinhanh) {
            const agency = await Admin_services.updateUserAgency(req.params.id, payload);
            if (agency !== 'Succes') return next(new ApiErr(500, "An error orcurred while update agency."));
        }
        if (payload.id_bophan !== oldDepartment.id_bophan) {
            const department = await Admin_services.updateUserDepartment(req.params.id, payload);
            if (department !== 'Succes') return next(new ApiErr(500, "An error orcurred while update depatment."));
        }
        if (payload.id_chucvu !== oldPosition.id_chucvu) {
            const position = await Admin_services.updateUserPosition(req.params.id, payload);
            if (position !== 'Succes') return next(new ApiErr(500, "An error orcurred while update position."));
        }
        const result_workinfo = await Admin_services.updateUserWorkInfo(req.params.id, payload);
        if (result_workinfo === 'Success') res.send('Update success.');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while update user.'));}
}

// Hien thi danh sach nhan vien
exports.ShowStaff = async (req, res, next) => {
    try {
        const staff = await Admin_services.showStaff();
        res.send(staff);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Tim kiem nhan vien
exports.SearchUser = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while search user.'));}
}

// Khoa tai khoan nhan vien
exports.DisableUser = async (req, res, next) => {
    try {
        res.send('ok');
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
