const Staff_account_services = require('../../../services/User/User_Accounts/user_account_services');
const Admin_Account_Services = require('../../../services/Admin/Admin_Accounts/admin_account_services');

const ApiErr = require('../../../api-error');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Dang nhap
exports.Login = async(req, res, next) => { 
    // Kiem tra dang nhap
    if (req.cookies.loggedin === 'true') return next(new ApiErr(400, 'Logged in already.'));
    if (!req.body?.msnv) return next(new ApiErr(400, 'Empty id and password'));
    // Dang nhap
    try {
        const account = await Staff_account_services.login(req.body);
        if (account.trangthai_taikhoan != 1) res.send('Blocked');
        else if (account.badlogin >= 5) {
            const block = await Admin_Account_Services.disableUser(account.msnv);
            if (!block) throw new Error('Fail to block user');
            res.send('Blocked');
        } else {
            bcrypt.compare(req.body.matkhau, account.matkhau, async function (err, result) {
                if (result) {
                    const resetBadLogin = await Staff_account_services.updateBadLogin(account.msnv, 0);
                    if (!resetBadLogin) throw new Error('Fail to update bad login');
                    const avt_url = await Staff_account_services.getUserAvt(account.msnv);
                    res.cookie('loggedin','true');
                    res.cookie('msnv', account.msnv);
                    res.cookie('position', account.id_bophan);
                    res.cookie('hoten', account.hoten);
                    res.cookie('avt_url', avt_url.avt_secure_url);
                    res.send(`Login success`);
                } else {
                    const badlogin = Number(account.badlogin);
                    const resetBadLogin = await Staff_account_services.updateBadLogin(account.msnv, (badlogin + 1));
                    if (!resetBadLogin) throw new Error('Fail to update bad login');
                    res.send('Your password is incorrect.');
                }
            })
        }
    }catch (err) {return next(new ApiErr(500, 'An error occurred while login.'));}
}

// Dang xuat
exports.Logout = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        res.cookie('loggedin','false');
        res.cookie('msnv', '');
        res.cookie('position', '');
        res.cookie('avt_url', '');
        res.cookie('hoten', '');
        res.send('Logout success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while logout.'));}
}

// Hien thi thong tin nhan vien
exports.ShowUserInfo = async (req, res, next) => {
    // Kiem tra dang nhap
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.cookies.msnv) return next(new ApiErr(401, 'Unknow id'));
    try {
        // Lay thong tin nguoi dung
        const msnv = req.cookies.msnv;
        const acc = await Staff_account_services.getUserAccountInfo(msnv);
        const usr_info = await Staff_account_services.getUserPersonalInfo(msnv);
        const work_info = await Staff_account_services.getUserWorkInfo(msnv);
        const laborcontract_info = await Staff_account_services.getUserLaborContract(msnv);
        const office_info = await Staff_account_services.getUserOffice(msnv);
        const area_info = await Staff_account_services.getUserArea(msnv);
        const position_info = await Staff_account_services.getUserPosition(msnv);
        const avt = await Staff_account_services.getUserAvt(msnv);

        const user = {
            taikhoan: acc,ttcn: usr_info,ttcv: work_info,hdld: laborcontract_info,
            chinhanh: office_info,bophan: area_info,chucvu: position_info,avt: avt,
        }

        const ngaysinh = new Date(`${user.ttcn.ngaysinh} UTC+0`);
        const ngaycap_cccd = new Date(`${user.ttcn.ngaycap_cccd} UTC+0`);
        const ngaybatdau = new Date (`${user.ttcv.ngaybatdau} UTC+0`);
        const ngaykyhopdong = new Date(`${user.hdld.ngaykyhopdong} UTC+0`);
        const luongcoban1h = parseInt(user.ttcv.luongcoban1h);
        user.ttcv.ngaybatdau = ngaybatdau.toLocaleDateString('en-GB');
        user.hdld.ngaykyhopdong = ngaykyhopdong.toLocaleDateString('en-GB');
        user.ttcn.ngaysinh = (user.ttcn.ngaysinh) ? ngaysinh.toLocaleDateString('en-GB') : null;
        user.ttcn.ngaycap_cccd = (user.ttcn.ngaycap_cccd) ? ngaycap_cccd.toLocaleDateString('en-GB') : null;
        user.ttcv.luongcoban1h = luongcoban1h;
        
        res.send(user);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load user information.'));}
}

// Cap nhat thong tin ca nhan
exports.UpdateUserInfo = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        const msnv = req.cookies.msnv;

        // Lay thong tin hien co kiem tra thay doi
        const cur_avt = await Staff_account_services.getUserAvt(msnv);
        const acc = await Staff_account_services.getUserAccountInfo(msnv);

        // Kiem tra cap nhat avt
        if (req.body.avt_public_id && (cur_avt.avt_public_id !== req.body.avt_public_id)) {
            const update_avt = await Staff_account_services.updateAvt(msnv, req.body);
            if (!update_avt) throw new Error('Fail');
        }

        // Kiem tra cap nhat account
        if (req.body.email !== acc.email || req.body.sdt !== acc.sdt) {
            const update_acc = await Staff_account_services.updateUserAcc(msnv, req.body);
            if (!update_acc) throw new Error('Fail');
        }

        // Cap nhat thong tin ca nhan
        const update_result = await Staff_account_services.updateUserInfo(msnv, req.body);
        if (!update_result) throw new Error('Fail');

        // Lay duong dan avt va cap nhat cookie luu thong tin avt
        const avt = await Staff_account_services.getUserAvt(msnv);
        res.cookie('avt_url', avt.avt_secure_url);

        // Tra ve ket qua
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred while update user information.'));}
}

// Doi mat khau tai khoan
exports.ChangePassword = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.body.matkhau || !req.body.matkhaumoi) return next(new ApiErr(400, 'Empty current password and new password'));
    try {
        const payload = {msnv: req.cookies.msnv, matkhau: req.body.matkhau, matkhaumoi: req.body.matkhaumoi};
        // Kiem tra mat khau hien tai
        const check = await Staff_account_services.login(payload);
        bcrypt.compare(payload.matkhau, check.matkhau, async (err, result) => {
            if (result) {
                bcrypt.hash(req.body.matkhaumoi, 10, async (err, hash) => {
                    if (!err) {
                        payload.matkhaumoi = hash;
                        const change = await Staff_account_services.changePass(payload);
                        if (!change) throw new Error('Fail');
                        res.send('Success');
                    }
                })
            } else {res.send('Your password is incorrect.');}
        })
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load pay sheet.'));}
}

// Hien thi bang luong ca nhan theo thang
exports.ShowPaysheet = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.body.dotluong) return next(new ApiErr(400, 'Provide month and year'));
    try {
        const paysheet = await Staff_account_services.getPaysheet(req.cookies.msnv, req.body.dotluong);
        res.send(paysheet);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while load pay sheet.'));}
}

// Hien thi bang cham cong theo thang
exports.ShowTimesheet = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.body.thang || !req.body.nam) return next(new ApiErr(400, 'Provide month and year'));
    try {
        const month = req.body.thang;
        const year = req.body.nam;
        const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const timesheet = await Staff_account_services.getTimesheet(req.cookies.msnv, month, path);
        res.send(timesheet);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while time sheet.'));}
}
