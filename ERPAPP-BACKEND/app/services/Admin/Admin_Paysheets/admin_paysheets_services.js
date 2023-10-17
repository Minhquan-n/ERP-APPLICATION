const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const config = require('../../../config');
const database = require('../../../mysql/database.connect');

const Admin_acc_services = require('../../Admin/Admin_Accounts/admin_account_services');

class PaySheet {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Khoi tao mau bang cham cong
    createTimeSheetForm (month, year) {
        const timesheet = [];
        // Tinh so ngay trong thang
        var m;
        const feb = (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28;
        if (month == 2) m = feb;
        else if (month != 2 && (month == 4 || month == 6 || month == 9 || month == 11)) m = 30;
        else m = 31;

        // Tao mau bang cham cong
        timesheet[0] = 'STT';
        timesheet[1] = 'MSNV';
        timesheet[2] = 'Name';
        timesheet[3] = 'Branch';
        timesheet[4] = 'Working_Type'
        for (var i = 5; i <= m + 4; i++) {
            timesheet[i] = (i-4).toString() + '/' + month;
        }
        return timesheet;
    }

    // Lay danh sach nhan vien
    async getStaffList () {
        const db = this.connection();
        const table = '((((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN (bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan) ON bp.msnv = tk.msnv) JOIN (chucvu cv JOIN danhsachchucvu dscv ON cv.id_chucvu = dscv.id_chucvu) ON cv.msnv = tk.msnv) JOIN thongtincongviec ttcv ON tk.msnv = ttcv.msnv) JOIN (chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) ON tk.msnv = cn.msnv';
        const selected = 'tk.msnv, ttcn.hoten, bp.id_bophan, dsbp.tenbophan, cv.id_chucvu, dscv.tenchucvu, ttcv.khautruBHXH, ttcv.khautruBHYT, ttcv.khautruBHTN, ttcv.luongcoban, ttcv.luongcoban1h, ttcv.loaihinhcongviec, cn.id_chinhanh, dscn.tenchinhanh';
        const query = `SELECT ${selected} FROM ${table} WHERE tk.trangthai_taikhoan = 1`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tao tap tin excel timesheet moi
    async createTimeSheetFile (month, year) {
        // Tao thong tin cho file excel
        const timeSheetHeader = this.createTimeSheetForm(month, year);
        const staff = await this.getStaffList();

        // Tao danh sach nhan vien
        var stafflist = []
        staff.forEach((e, i) => {
            const item = {
                stt: i,
                msnv: e.msnv,
                hoten: e.hoten,
                tenchinhanh: e.tenchinhanh,
                loaihinhcongviec: e.loaihinhcongviec
            };
            stafflist.push(item);
        });

        // Xuat du lieu sang file excel
        try {
            const filePath = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
            // Xuat du lieu sang excel
            const ws = xlsx.utils.json_to_sheet(stafflist);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, month.toString());
            xlsx.utils.sheet_add_aoa(ws, [timeSheetHeader], { origin: 0 });
            // Cai dat do rong cot
            const maxWidth_msnv = await staff.reduce((w, r) => Math.max(w, r.msnv.length), 10);
            const maxWidth_name = await staff.reduce((w, r) => Math.max(w, r.hoten.length), 10);
            ws['!cols'] = [{wch: 3}, {wch: maxWidth_msnv}, {wch: maxWidth_name}, {wch: 12}];
            // Ghi vao file excel
            xlsx.writeFile(wb, path.resolve(filePath), { compression: true });
            return 'Success';
        } catch (err) {return err;}
    }

    // Tao sheet moi trong tap tin timesheet da co
    async createTimeSheet (month, year, filePath) {
        const timeSheetHeader = this.createTimeSheetForm(month, year);
        const staff = await this.getStaffList();

        // Tao danh sach nhan vien
        var stafflist = []
        staff.forEach((e, i) => {
            const item = {
                stt: i,
                msnv: e.msnv,
                hoten: e.hoten,
                tenchinhanh: e.tenchinhanh,
                loaihinhcongviec: e.loaihinhcongviec
            };
            stafflist.push(item);
        });

        // Xuat du lieu sang file excel
        try {
            // Tao sheet moi
            const wb = xlsx.readFile(filePath);
            const ws = xlsx.utils.json_to_sheet(stafflist);
            xlsx.utils.book_append_sheet(wb, ws, month.toString());
            xlsx.utils.sheet_add_aoa(ws, [timeSheetHeader], { origin: 0 });
            // Cai dat do rong cot
            const maxWidth_msnv = await staff.reduce((w, r) => Math.max(w, r.msnv.length), 10);
            const maxWidth_name = await staff.reduce((w, r) => Math.max(w, r.hoten.length), 10);
            ws['!cols'] = [{wch: 3}, {wch: maxWidth_msnv}, {wch: maxWidth_name}, {wch: 12}];
            // Ghi vao file excel
            xlsx.writeFile(wb, path.resolve(filePath), { compression: true });
            return 'Success';
        } catch (err) {return err;}
    }

    // Lay toan bo bang cham cong
    async getAllTimesheet (month, filePath) {
        const wb = xlsx.readFile(filePath);
        const ws = wb.Sheets[`${month}`];
        const data = xlsx.utils.sheet_to_json(ws, {header: 2});
        return data;
    }

    // Lay ten chi nhanh
    async getBranchName (id) {
        const db = this.connection();
        const query = `SELECT tenchinhanh FROM danhsachchinhanh WHERE id_chinhanh = ${id}`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay bang cham cong theo chi nhanh
    async getTimesheet (month, filePath, branch) {
        const data = await this.getAllTimesheet(month, filePath);
        const branchName = await this.getBranchName(branch);
        var timesheet = [];
        data.forEach((e, i) => {
            if (e.Branch === branchName.tenchinhanh) timesheet.push(e);
        });
        return timesheet;
    }

    // Map timesheet moi nhap vao timesheet hien tai
    async mapTimesheet (payload, month, filePath) {
        var timesheet = await this.getAllTimesheet(month, filePath);
        payload.forEach((e, i) => {
            timesheet[Number(e.STT)] = e;
        });
        return timesheet;
    }

    // Cham cong
    async timekeeping (payload, month, filePath) {
        try {
            // map json to sheet
            const timesheet = await this.mapTimesheet(payload, month, filePath);
            const wb = xlsx.readFile(filePath);
            var ws = wb.Sheets[`${month}`];
            xlsx.utils.sheet_add_json(ws, timesheet, {origin: 0});
            // Cai dat do rong cot
            const maxWidth_msnv = await timesheet.reduce((w, r) => Math.max(w, r.MSNV.length), 10);
            const maxWidth_name = await timesheet.reduce((w, r) => Math.max(w, r.Name.length), 10);
            ws['!cols'] = [{wch: 3}, {wch: maxWidth_msnv}, {wch: maxWidth_name}, {wch: 12}];
            // Luu file
            xlsx.writeFile(wb, path.resolve(filePath), {compression: true});

            return 'Success';
        } catch (err) {return err};
    }

    // Tinh ngay lam viec toan bo bang cham cong va luu vao file cham cong
    async workingdayCaculate (month, filePath) {
        var wh = [];
        const wb = xlsx.readFile(filePath);
        var ws = wb.Sheets[`${month}`];
        var data = xlsx.utils.sheet_to_json(ws, {header: 2});
        // Tinh tong so gio lam viec
        data.forEach((e, i) => {
            e.working_hour = 0;
            const item = Object.values(e);
            var count = 0;
            var dayoff = 0;
            for (var j = 5; j < item.length - 1; j++) {
                if (item[j] === 'p') {
                    dayoff++;
                    count += 8;
                } else if (item[j] === 'x') count += 8;
                else count += (8 + (item[j]));
            }
            e.working_hour = count;
            e.vacation_days = dayoff;
            const temp = {
                msnv: e.MSNV,
                working_hour: count,
                vacation_day: dayoff
            };
            wh.push(temp);
        });        
        return wh;
    }

    // Tinh tong so nhan vien thang truoc
    async staffCount (month, filePath) {
        const wb = xlsx.readFile(filePath);
        const data = xlsx.utils.sheet_to_json((wb.Sheets[`${month}`]), {header: 2});
        return data.length;
    }

    // Tao paysheet moi DB
    async createPaySheetSumary (date, month, year, timesheetPath) {
        const db = this.connection();
        const id = month + '/' + year;
        const today = year + '/' + (month + 1) + '/' + date;
        const staff = await this.staffCount(month, timesheetPath);
        const query = `INSERT INTO dotluong (id_dotluong, ngaycham, thang, nam, tongnhanvien) VALUES ('${id}', '${today}', ${month}, ${year}, ${staff})`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        })
    }

    // Tao paysheet header
    createPaysheetForm () {
        const paysheet = ['STT', 'MSNV', 'Ho_Ten', 'Gio_Lam', 'Gio_Tang_Ca', 'BHXH', 'BHYT', 'BHTN', 'Luong_Co_Ban', 'Tang_Ca', 'Thuong', 'Thuc_Lanh', 'Ghi_Chu'];
        return paysheet;
    }

    // Them 1 bang luong nhan vien vao DB
    async insertUserPaysheet (user, id_dotluong) {
        const db = this.connection();
        const field = 'msnv, sogiolam, sogiotangca, BHXH, BHYT, BHTN, luongtangca, id_dotluong';
        const inputData = `'${user.msnv}', ${user.sogiolam}, ${user.sogiotangca}, ${user.BHXH}, ${user.BHYT}, ${user.BHTN}, ${user.luongtangca}, '${id_dotluong}'`;
        const query = `INSERT INTO bangluongnhanvien (${field}) VALUES (${inputData})`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Lay thong tin nhan vien cho bang luong
    async userPaysheet (staffList, month, year) {
        const id_dotluong = month + '/' + year;
        const timesheetpath = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const hour = {1: 208, 2: 104};
        var stafflist = [];
        try {
            const working_hour = await this.workingdayCaculate(month, timesheetpath);
            staffList.forEach(async (e, i) => {
                const sogiotangca = Math.max((working_hour[i].working_hour - hour[Number(e.loaihinhcongviec)]), 0);
                const user = {
                    stt: i,
                    msnv: e.msnv,
                    hoten: e.hoten,
                    sogiolam: working_hour[i].working_hour,
                    sogiotangca: sogiotangca,
                    BHXH: (e.luongcoban * (e.khautruBHXH / 100)),
                    BHYT: (e.luongcoban * (e.khautruBHYT / 100)),
                    BHTN: (e.luongcoban * (e.khautruBHTN / 100)),
                    luongcoban: e.luongcoban,
                    luongtangca: (e.luongcoban1h * sogiotangca)
                };
                stafflist.push(user);
                const userPaysheet = await this.insertUserPaysheet(user, id_dotluong);
                if (!userPaysheet) throw new Error('Fail');
            });
        } catch (err) {return 'Fail'};
        return stafflist;
    }

    // Tao sheet bang luong cho tung nhan vien
    async createPaySheetFile (month, year) {
        const paysheetpath = process.env.PAYROLLS_PATH + '\\' + year + '.xlsx';
        const staffList = await this.getStaffList();
        const paysheetHeader = this.createPaysheetForm();
        try {
            const stafflist = await this.userPaysheet(staffList, month, year);
            if (staffList === 'Fail') throw new Error('Fail');
            const ws = xlsx.utils.json_to_sheet(stafflist);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, month.toString());
            xlsx.utils.sheet_add_aoa(ws, [paysheetHeader], { origin: 0 });

            // Ghi vao file excel
            xlsx.writeFile(wb, path.resolve(paysheetpath), { compression: true });
        } catch (err) {return err};
        return 'Success';
    }

    // Tao sheet moi bang luong nhan vien
    async createPaySheet (month, year) {
        const paysheetpath = process.env.PAYROLLS_PATH + '\\' + year + '.xlsx';
        const staffList = await this.getStaffList();
        const paysheetHeader = this.createPaysheetForm();

        try {
            const stafflist = await this.userPaysheet(staffList, month, year);
            if (staffList === 'Fail') throw new Error('Fail');
            const wb = xlsx.readFile(paysheetpath);
            const ws = xlsx.utils.json_to_sheet(stafflist);
            xlsx.utils.book_append_sheet(wb, ws, month.toString());
            xlsx.utils.sheet_add_aoa(ws, [paysheetHeader], { origin: 0 });

            // Ghi vao file excel
            xlsx.writeFile(wb, path.resolve(paysheetpath), { compression: true });
        } catch (err) {return err};
        return 'Success';
    }

    // Lay danh sach bang luong tu DB
    async getPaysheetList () {
        const db = this.connection();
        const query = 'SELECT id_dotluong FROM dotluong';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }
}

module.exports = new PaySheet();