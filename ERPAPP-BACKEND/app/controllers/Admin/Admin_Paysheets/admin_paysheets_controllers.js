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
            if (data !== 'Success') return next(new ApiErr(500, 'An error orcurred while create new time sheets file.'));
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
        if (!branch || branch === 0) {
            data = await services.getAllTimesheet(month, path);
        } else {
            data = await services.getTimesheet(month, path, branch);
        }
        res.send(data);
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while show timesheet.'));}
    
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
    } catch (err) {return next(new ApiErr(500, 'An error orcurred while timekeeping for user.'));}
}

// Tao bang luong cho tung nhan vien
exports.CreatePaysheet = async (req, res, next) => {  
    // Tong hop ngay cong nhan vien
    const today = new Date();
    const date = today.getDate();
    const month = (today.getMonth() === 0) ? 12 : today.getMonth();
    const year = (today.getMonth() === 0) ? today.getFullYear - 1 : today.getFullYear();
    const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
    const paysheetPath = process.env.PAYROLLS_PATH + '\\' + year + '.xlsx';

    try {
        // Tao dot luong
        const paysheetSumary = await services.createPaySheetSumary(date, month, year, path);
        if (!paysheetSumary) return next(new ApiErr(500, 'Error'));

        // Tao paysheet moi
        const wb = xlsx.readFile(paysheetPath);
        if (wb.Sheets[`${month}`]) res.send('This month paysheet created.');
        const newPaysheet = await services.createPaySheet(month, year);
        if (newPaysheet !== 'Success') return next(new ApiErr(500, 'An error orcurred while create new paysheet.'));
        res.send('Success');
    } catch (err) {
        if (err.code === 'ENOENT') {
            const newPaysheetFile = await services.createPaySheetFile(month, year);
            if (newPaysheetFile !== 'Success') return next(new ApiErr(500, 'An error orcurred while create new paysheet.'));
            res.send('Success');
        } else if (err.code === 'ER_DUP_ENTRY') res.send('This month paysheet created.');
        else return next(new ApiErr(500, 'An error orcurred while create new paysheet.'));
    }
}

// Hien thi bang luong tat ca nhan vien trong theo thang
exports.ShowPaysheets = async (req, res, next) => {
    if (!req.body.month || !req.body.year) return next(new ApiErr(400, 'Provide month and year.'));
    const month = req.body.month;
    const year = req.body.year;
    const paysheetpath = process.env.PAYROLLS_PATH + '\\' + year + '.xlsx';
    try {
        const wb = xlsx.readFile(paysheetpath);
        const ws = wb.Sheets[`${month}`];
        const paysheet = xlsx.utils.sheet_to_json(ws, {header: 2});
        res.send(paysheet);
    } catch (err) {
        if (err.code === 'ENOENT') return next(new ApiErr(500, 'This paysheets file is not exists.'));
        else return next(new ApiErr(500, err));
    }
}

// Lay danh sach cac bang luong tu file
exports.GetPaysheetList = async (req, res, next) => {
    try {
        const paysheetList = await services.getPaysheetList();
        res.send(paysheetList);
    } catch (err) {return next(new ApiErr(500, 'An error occured while load paysheet list.'))};
}