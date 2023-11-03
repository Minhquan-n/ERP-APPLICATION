const services = require('../../../services/Admin/Admin_Paysheets/admin_paysheets_services');

const xlsx = require('xlsx');

require('dotenv').config();

const ApiErr = require('../../../api-error');

// Tao bang cham cong moi
exports.CreateTimesheet = async (req, res, next) => {
    // Lay ngay thang nam hien tai tao thong tin file cham cong
    const today = new Date();
    const day = today.getDate();
    // Thang duoc tinh tu 0 -> 11;
    const month = today.getMonth() + 1;
    const year = (today.getFullYear());
    try {
        const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const wb_check = xlsx.readFile(path);
        if (wb_check.Sheets[`${month}`]) return next(new ApiErr(400, 'Time sheet created!'));
        const wb = await services.createTimeSheet(month, year, path);
        res.send(wb);
    } catch (err) {
        // Neu chua co tap tin cham cong nam hien tai -> tao moi
        if (err.code === 'ENOENT') {
            const data = await services.createTimeSheetFile(month, year);
            if (data !== 'Success') return next(new ApiErr(500, 'An error occurred while create new time sheets file.'));
            res.send(data);
        }
    }
}

// Hien thi bang cham cong
exports.ShowTimesheet = async (req, res, next) => {
    if (!req.body.thang || !req.body.nam) return next(new ApiErr(400, 'Provide month, year and branch to get time sheet.'));
    try {
        const month = req.body.thang;
        const year = req.body.nam;
        const branch = req.body.chinhanh;
        const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        var data;
        if (!branch || branch === '0') {
            data = await services.getAllTimesheet(month, path);
        } else {
            data = await services.getTimesheet(month, path, branch);
        }
        res.send(data);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while show timesheet.'));}
    
    
}

// Cham cong
exports.Timekeeping = async (req, res, next) => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const data = await services.timekeeping(req.body, month, path);
        if (data !== 'Success') throw err;
        res.send(data);
    } catch (err) {return next(new ApiErr(500, 'An error occurred while timekeeping for user.'));}
}

// Tao bang luong cho tung nhan vien
exports.CreatePaysheet = async (req, res, next) => {  
    // Tong hop ngay cong nhan vien
    const today = new Date();
    const date = today.getDate();
    const month = (today.getMonth() === 0) ? 12 : today.getMonth();
    const year = (today.getMonth() === 0) ? today.getFullYear - 1 : today.getFullYear();
    const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';

    try {
        // Tao dot luong
        const paysheetSumary = await services.createPaySheetSumary(date, month, year, path);
        if (!paysheetSumary) throw new Error('Paysheet sumary error.');

        // Tao bang luog cho nhan vien
        const userPaysheet = await services.userPaysheet(month, year);
        if (!userPaysheet) return new Error('User paysheet error.');
        res.send('Success');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return next(new ApiErr(400, 'This month paysheet exists.'));
        return next(new ApiErr(500, err));
    }
}

// Hien thi bang luong tat ca nhan vien theo thang
exports.ShowPaysheets = async (req, res, next) => {
    if (!req.body.dotluong) return next(new ApiErr(400, 'Provide month and year.'));
    const id_dotluong = req.body.dotluong;
    const branch = req.body.chinhanh;
    try {
        var paysheets;
        if (!branch || branch === 0) {
            paysheets = await services.getAllUserPaysheet(id_dotluong);
            if (paysheets.length === 0) throw new Error('Fail');
        } else {
            paysheets = await services.getAllUserPaysheetOfBranch(id_dotluong, branch);
            if (paysheets.length === 0) throw new Error('Fail');
        }
        res.send(paysheets);
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while load paysheets.'));
    }
}

// Khoa bang luong
exports.BlockPaysheet = async (req, res, next) => {
    if (!req.body.dotluong) return next(new ApiErr(400, 'Provide payroll id.'));
    try {
        const block = await services.blockPaysheet(req.body.dotluong);
        if (!block) throw new Error('Fail');
        res.send('Success');
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while block user paysheet.'));
    }
}

// Lay danh sach cac dot luong
exports.GetPaysheetList = async (req, res, next) => {
    try {
        const paysheetList = await services.getPaysheetList();
        res.send(paysheetList);
    } catch (err) {return next(new ApiErr(500, 'An error occured while load paysheet list.'))};
}

// Chinh sua bang luong cho nhan vien
exports.UpdatePaySheet = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return next(new ApiErr(400, 'Empty'));
    try {
        const update = await services.updatePaysheet(req.body);
        if (!update) throw new Error('Fail');
        res.send('Success');
    } catch (err) {return next(new ApiErr(500, 'An error occurred wile update user paysheets.'))};
}