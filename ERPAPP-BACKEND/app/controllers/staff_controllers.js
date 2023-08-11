const staff_services = require('../services/staff_services');
const ApiErr = require('../api-error');
const bcrypt = require('bcrypt');

// Dang nhap
exports.Login = async(req, res, next) => {
    if (req.cookies.loggedin === 'true') return next(new ApiErr(400, 'Logged in already.'));
    if (!req.body) return next(new ApiErr(400, 'Your ID and password are empty'));
    try {
        const account = await staff_services.login(req.body);
        if (account.trangthai_taikhoan != 1) res.send('Your account has blocked.');
        else {
            bcrypt.compare(req.body.matkhau, account.matkhau, async function (err, result) {
                if (result) {
                    res.cookie('loggedin','true');
                    res.cookie('msnv', account.msnv);
                    res.cookie('isAdmin', account.isAdmin);
                    res.send(account);
                } else return next(new ApiErr(500, 'Your password is incorrect.'));
            })
        }
    }catch (err) {return next(new ApiErr(500, 'An error orcurred while login.'));}
}

// Dang xuat
exports.Logout = async (req, res, next) => {
    if (!req.cookies.loggedin || req.cookies.loggedin === 'false') return next(new ApiErr(400, 'No account are logging in.'));
    try {
        res.cookie('loggedin','false');
        res.cookie('msnv', '');
        res.cookie('isAdmin', '');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while logout.'));}
}

// Hien thi thong tin nhan vien
exports.ShowUserInfo = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load user information.'));}
}

// Cap nhat thong tin ca nhan cua nhan vien
exports.UpdateUserInfo = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while update user information.'));}
}

// Hien thi bang luong ca nhan
exports.ShowPaySheet = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while load pay sheet.'));}
}

// Hien thi bang cham cong
exports.ShowTimeSheet = async (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while time sheet.'));}
}

