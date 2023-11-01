const xlsx = require('xlsx');
const path = require('path');

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
        const query = `SELECT ${selected} FROM ${table} WHERE tk.trangthai_taikhoan = 1 AND bp.trangthai = 1 AND cn.trangthai = 1 ORDER BY tk.stt`;
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

    // Lay bang cham cong theo chi nhanh
    async getTimesheet (month, filePath, branch) {
        const data = await this.getAllTimesheet(month, filePath);
        var timesheet = [];
        data.forEach((e, i) => {
            if (e.Branch === branch) timesheet.push(e);
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
            const item = Object.values(e);
            console.log(item);
            var count = 0;
            var dayoff = 0;
            for (var j = 5; j < item.length; j++) {
                if (item[j] === 'p') {
                    dayoff++;
                    count += 8;
                } else if (item[j] === 'x') count += 8;
                else if (item[j] === 'v') count += 0;
                else count += (8 + Number(item[j]));
            }
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

    // Them 1 bang luong nhan vien vao DB
    async insertUserPaysheet (user, id_dotluong) {
        const db = this.connection();
        const field = 'msnv, sogiolam, sogiotangca, BHXH, BHYT, BHTN, luongtangca, thuong, thuclanh, id_dotluong';
        const inputData = `'${user.msnv}', ${user.sogiolam}, ${user.sogiotangca}, ${user.BHXH}, ${user.BHYT}, ${user.BHTN}, ${user.luongtangca}, ${user.thuong}, ${user.thuclanh}, '${id_dotluong}'`;
        const query = `INSERT INTO bangluongnhanvien (${field}) VALUES (${inputData})`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Lay gio lam chuan va % tang ca
    getStandarHour () {
        const stdHour = [
            {sogiolamviec: 216, tangca: 2},
            {sogiolamviec: 108, tangca: 1.5}
        ]
        return stdHour;
    }

    // Lay thong tin nhan vien cho bang luong
    async userPaysheet (month, year) {
        const id_dotluong = month + '/' + year;
        const timesheetpath = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const stdHour = this.getStandarHour();
        const staffList = await this.getStaffList();
        // var stafflist = [];
        try {
            const working_hour = await this.workingdayCaculate(month, timesheetpath);
            console.log(working_hour);
            working_hour.forEach(async (e) => {
                const userindex = staffList.findIndex((element) => {
                    return element.msnv === e.msnv
                });
                if (userindex !== -1) {
                    const sogiotangca = Math.max((e.working_hour - stdHour[Number(staffList[userindex].loaihinhcongviec) - 1].sogiolamviec), 0);
                    const bhxh = (staffList[userindex].luongcoban * (staffList[userindex].khautruBHXH / 100));
                    const bhyt = (staffList[userindex].luongcoban * (staffList[userindex].khautruBHYT / 100));
                    const bhtn = (staffList[userindex].luongcoban * (staffList[userindex].khautruBHTN / 100));
                    const tangca = (staffList[userindex].luongcoban1h * sogiotangca) * stdHour[Number(staffList[userindex].loaihinhcongviec) - 1].tangca;
                    const thuclanhtam = (staffList[userindex].luongcoban + tangca) - (bhxh + bhyt + bhtn);
                    const user = {
                        msnv: staffList[userindex].msnv,
                        sogiolam: e.working_hour,
                        sogiotangca: sogiotangca,
                        BHXH: bhxh,
                        BHYT: bhyt,
                        BHTN: bhtn,
                        luongtangca: tangca,
                        thuong: 0,
                        thuclanh: thuclanhtam,
                    };
                    // stafflist.push(user);
                    const userPaysheet = await this.insertUserPaysheet(user, id_dotluong);
                    if (!userPaysheet) throw new Error('Fail');
                }
            });
            return true;
        } catch (err) {return false};
    }

    // Lay danh sach bang luong tu DB
    async getPaysheetList () {
        const db = this.connection();
        const query = 'SELECT id_dotluong FROM dotluong';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach tat ca bang luong cua nhan vien theo thang
    async getAllUserPaysheet (id_dotluong) {
        const db = this.connection();
        const select = 'blnv.id_bangluong, tk.msnv, blnv.sogiolam, blnv.sogiotangca, blnv.BHXH, blnv.BHYT, blnv.BHTN, ttcv.luongcoban, ttcv.luongcoban1h, blnv.luongtangca, blnv.thuong, blnv.thuclanh, blnv.ghichu, blnv.id_dotluong, ttcn.hoten, dscn.tenchinhanh, dsbp.tenbophan, dscv.tenchucvu';
        const table = 'bangluongnhanvien blnv JOIN (((((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN thongtincongviec ttcv ON tk.msnv = ttcv.msnv) JOIN (chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) ON tk.msnv = cn.msnv) JOIN (bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan) ON tk.msnv = bp.msnv) JOIN (chucvu cv JOIN danhsachchucvu dscv ON cv.id_chucvu = dscv.id_chucvu) ON tk.msnv = cv.msnv) ON tk.msnv = blnv.msnv';
        const query = `SELECT ${select} FROM ${table} WHERE blnv.id_dotluong = '${id_dotluong}' AND cn.trangthai = 1 ORDER BY tk.stt`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach bang luong nhan vien theo chi nhanh
    async getAllUserPaysheetOfBranch (id_dotluong, id_chinhanh) {
        const db = this.connection();
        const select = 'blnv.id_bangluong, tk.msnv, blnv.sogiolam, blnv.sogiotangca, blnv.BHXH, blnv.BHYT, blnv.BHTN, ttcv.luongcoban, ttcv.luongcoban1h, blnv.luongtangca, blnv.thuong, blnv.thuclanh, blnv.ghichu, blnv.id_dotluong, ttcn.hoten, dscn.tenchinhanh, dsbp.tenbophan, dscv.tenchucvu';
        const table = 'bangluongnhanvien blnv JOIN (((((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN thongtincongviec ttcv ON tk.msnv = ttcv.msnv) JOIN (chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) ON tk.msnv = cn.msnv) JOIN (bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan) ON tk.msnv = bp.msnv) JOIN (chucvu cv JOIN danhsachchucvu dscv ON cv.id_chucvu = dscv.id_chucvu) ON tk.msnv = cv.msnv) ON tk.msnv = blnv.msnv';
        const query = `SELECT ${select} FROM ${table} WHERE blnv.id_dotluong = '${id_dotluong}' AND cn.id_chinhanh = ${id_chinhanh} AND cn.trangthai = 1 ORDER BY tk.stt`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay bang luong cu cua nhan vien
    async getOldPaysheet (id_bangluong) {
        const db = this.connection();
        const select = 'blnv.id_bangluong, blnv.sogiolam, blnv.sogiotangca, blnv.BHXH, blnv.BHYT, blnv.BHTN, ttcv.luongcoban, ttcv.luongcoban1h, ttcv.loaihinhcongviec';
        const query = `SELECT ${select} FROM bangluongnhanvien blnv JOIN thongtincongviec ttcv ON blnv.msnv = ttcv.msnv WHERE blnv.id_bangluong = '${id_bangluong}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin cap nhat
    async extractpayload_updatepaysheet (payload) {
        const oldPaysheet = await this.getOldPaysheet(payload.id_bangluong);
        const stdHour = this.getStandarHour();
        const giotangca = payload.sogiolam - stdHour[oldPaysheet.loaihinhcongviec - 1].sogiolamviec;
        const luongtangca = (oldPaysheet.luongcoban1h * giotangca) * stdHour[oldPaysheet.loaihinhcongviec - 1].tangca;
        const thuclanh = (oldPaysheet.luongcoban + luongtangca + Number(payload.thuong)) - (oldPaysheet.BHXH + oldPaysheet.BHYT + oldPaysheet.BHTN);
        const paysheet = {
            id_bangluong: payload.id_bangluong,
            sogiolam: payload.sogiolam,
            sogiotangca: giotangca,
            luongtangca: luongtangca,
            thuong: payload.thuong,
            thuclanh: thuclanh,
            ghichu: payload.ghichu
        }
        return paysheet;
    }

    // Cap nhat bang luong nv
    async updatePaysheet (payload) {
        const db = this.connection();
        const userPaysheet = await this.extractpayload_updatepaysheet(payload);
        const field = `sogiolam = ${userPaysheet.sogiolam}, sogiotangca = ${userPaysheet.sogiotangca}, luongtangca = ${userPaysheet.luongtangca}, thuong = ${userPaysheet.thuong}, thuclanh = ${userPaysheet.thuclanh}, ghichu = '${userPaysheet.ghichu}'`;
        const query = `UPDATE bangluongnhanvien SET ${field} WHERE id_bangluong = '${userPaysheet.id_bangluong}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }
}

module.exports = new PaySheet();