const Staff_account_services = require('../services/staff/staff_services_accounts');
const ApiErr = require('../api-error');
const bcrypt = require('bcrypt');

// Dang nhap
exports.Login = async(req, res, next) => {
    if (req.cookies.loggedin === 'true') return next(new ApiErr(400, 'Logged in already.'));
    if (!req.body?.msnv) return next(new ApiErr(400, 'Your ID and password are empty'));
    try {
        const account = await Staff_account_services.login(req.body);
        if (account.trangthai_taikhoan != 1) res.send('Your account has blocked.');
        else {
            bcrypt.compare(req.body.matkhau, account.matkhau, async function (err, result) {
                if (result) {
                    const avt_url = await Staff_account_services.getUserAvt(account.msnv);
                    res.cookie('loggedin','true');
                    res.cookie('msnv', account.msnv);
                    res.cookie('position', account.id_bophan);
                    res.cookie('avt_url', avt_url.avt_secure_url);
                    res.send(`Welcome back ${account.hoten}`);
                } else return next(new ApiErr(500, 'Your password are incorrect.'));
            })
        }
    }catch (err) {return next(new ApiErr(500, 'An error orcurred while login.'));}
}

// Dang xuat
exports.Logout = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        res.cookie('loggedin','false');
        res.cookie('msnv', '');
        res.cookie('position', '');
        res.cookie('avt_url', '');
        res.send('Logout success');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while logout.'));}
}

// Hien thi thong tin nhan vien
exports.ShowUserInfo = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.cookies.msnv) return next(new ApiErr(401, 'Unknow MSNV.'));
    try {
        const msnv = req.cookies.msnv;
        const acc = await Staff_account_services.getUserAccountInfo(msnv);
        const usr_info = await Staff_account_services.getUserPersonalInfo(msnv);
        const work_info = await Staff_account_services.getUserWorkInfo(msnv);
        const laborcontract_info = await Staff_account_services.getUserLaborContract(msnv);
        const agency_info = await Staff_account_services.getUserAgency(msnv);
        const department_info = await Staff_account_services.getUserDepartment(msnv);
        const position_info = await Staff_account_services.getUserPosition(msnv);
        const avt = await Staff_account_services.getUserAvt(msnv);
        const user = Object.assign(acc, usr_info, work_info, laborcontract_info, agency_info, department_info, position_info, avt);
        const ngaybatdau = new Date (`${user.ngaybatdau} UTC+0`);
        const ngaykyhopdong = new Date(`${user.ngaykyhopdong} UTC+0`);
        user.ngaybatdau = ngaybatdau.toLocaleDateString('en-GB');
        user.ngaykyhopdong = ngaykyhopdong.toLocaleDateString('en-GB');
        res.send(user);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Cap nhat thong tin ca nhan cua nhan vien
exports.UpdateUserInfo = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        const msnv = req.cookies.msnv;
        const cur_avt = await Staff_account_services.getUserAvt(msnv);
        if (req.body.avt_public_id && (cur_avt.avt_public_id !== req.body.avt_public_id)) {
            const update_avt = await Staff_account_services.updateAvt(msnv, req.body);
            if (update_avt !== 'Update avatar success.') return next(new ApiErr(500, 'An error orcurred while update avatar.'));
        }
        const update_result = await Staff_account_services.updateUserInfo(msnv, req.body);
        if (update_result === 'Update success.') {
            const avt = await Staff_account_services.getUserAvt(msnv);
            res.cookie('avt_url', avt.avt_secure_url);
            res.send(update_result);
        }
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while update user information.'));}
}

// Doi mat khau tai khoan
exports.ChangePassword = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    if (!req.body?.matkhau) return next(new ApiErr(400, 'Provide your password.'));
    try {
        const payload = {msnv: req.cookies.msnv, matkhau: req.body.matkhau, matkhaumoi: req.body.matkhaumoi};
        const check = await Staff_account_services.login(payload);
        bcrypt.compare(payload.matkhau, check.matkhau, async (err, result) => {
            if (result) {
                bcrypt.hash(req.body.matkhaumoi, 10, async (err, hash) => {
                    if (!err) {
                        payload.matkhaumoi = hash;
                        const change = await Staff_account_services.changePass(payload);
                        res.send(change);
                    }
                })
            } else {res.send('Your password are incorrect.');}
        })
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load pay sheet.'));}
}

// Hien thi bang luong ca nhan
exports.ShowPaySheet = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load pay sheet.'));}
}

// Hien thi bang cham cong
exports.ShowTimeSheet = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(401, 'No account were signed in.'));
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while time sheet.'));}
}

