const config = require('../../../config');
const database = require('../../../mysql/database.connect');
const xlsx = require('xlsx');
require('dotenv').config();

class Admin_User_Dashboard {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Lay tong so nhan vien trong he thong
    async getAllUser () {
        const db = this.connection();
        const query = 'SELECT soluongnhanvien FROM doanhnghiep WHERE msdn = "2805514562"';
        const data = (await db).execute(query);
        return data.then((data) => {
            return data[0][0];
        })
    }

    // Ham dem so luong nhan vien theo gioi tinh
    async countUserByGender (gender) {
        const db = this.connection();
        const condition = (gender === 'null') ? 'WHERE gioitinh IS NULL' : `WHERE gioitinh = '${gender}'`;
        const query = `SELECT COUNT(msnv) as soluong FROM thongtincanhan ${condition}`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Ham lay tong so luong
    async getTotalSalary (month, year) {
        const db = this.connection();
        const dotluong = month + '/' + year;
        const query = `SELECT tongluong, id_dotluong FROM dotluong WHERE id_dotluong = '${dotluong}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Ham lay tong so luong cua tung bo phan
    async getDepartmentTotalSalary (month, year) {
        const db = this.connection();
        const dotluong = month + '/' + year;
        const select = 'SUM(blnv.thuclanh) AS luong, dsbp.tenbophan';
        const table = 'bangluongnhanvien blnv JOIN (bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan) ON blnv.msnv = bp.msnv';
        const condition = `blnv.id_dotluong = '${dotluong}' AND bp.trangthai = 1 AND blnv.trangthai = 1`;
        const query = `SELECT ${select} FROM ${table} WHERE ${condition} GROUP BY bp.id_bophan`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tong hop cac thong tin
    async overview () {
        const today = new Date();
        const month = (today.getMonth() === 0) ? 12: today.getMonth();
        const year = (today.getMonth() === 0) ? today.getFullYear() - 1 : today.getFullYear();

        const allUser = await this.getAllUser();
        const male = await this.countUserByGender('Nam');
        const female = await this.countUserByGender('Nữ');
        const unknown = await this.countUserByGender('null');
        var departmentTotalSalary;
        var deparMonth = month;
        var deparYear = year;
        do {
            departmentTotalSalary = await this.getDepartmentTotalSalary(deparMonth, deparYear);
            deparMonth--;
            if (deparMonth === 0) deparYear--;
        } while (departmentTotalSalary.length === 0);

        var salary;
        var totalMonth = month;
        var totalYear = year;
        do {
            salary = await this.getTotalSalary(totalMonth, totalYear);
            totalMonth--;
            if (totalMonth === 0) totalYear--;
        } while (!salary.tongluong)

        const overview = {
            tongnhanvien: allUser,
            gioitinh: [male.soluong, female.soluong, unknown.soluong],
            luong: salary,
            luongtheobophan: departmentTotalSalary,
        };
        return overview;
    }

    // Tinh trung binh gio tang ca theo dot luong
    async getAvgOT (dotluong) {
        const db = this.connection();
        const query = `SELECT COUNT(*) AS tongnhanvien, AVG(sogiotangca) AS sogiotangcatrungbinh FROM bangluongnhanvien WHERE id_dotluong = '${dotluong}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Tong hop thong tin trung binh gio tang ca
    async avgOT (month, year) {
        const lastmonth = (month === 1) ? 12 : (month - 1);
        const lastyear = (month === 1) ? (year - 1) : year;
        const dotluong = month + '/' + year;
        const dotluongcu = lastmonth + '/' + lastyear;
        const curr = await this.getAvgOT(dotluong);
        const last = await this.getAvgOT(dotluongcu);
        const xuhuong = (Number(curr.sogiotangcatrungbinh) - Number(last.sogiotangcatrungbinh));
        curr.xuhuong = xuhuong;
        return curr;
    }

    // Tinh ngay cao diem
    async otOnWeek (month, year) {
        const week = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        }
        const path = process.env.TIMESHEET_PATH + '\\' + year + '.xlsx';
        const wb = xlsx.readFile(path);
        const ws = wb.Sheets[`${month}`];
        const data = xlsx.utils.sheet_to_json(ws, {header: 2});
        const key = Object.keys(data[0]);
        data.forEach(element => {
            const values = Object.values(element);
            for (var i = 5; i < values.length; i++) {
                if (values[i] !== 'x' && values[i] !== 'p' && values[i] !== 'v' && Number(values[i]) > 0) {
                    const strday = key[i].split('/');
                    const date = new Date(`${year}-${strday[1]}-${strday[0]} `);
                    const day = date.getDay();
                    week[`${day}`] += Number(values[i]);
                }
            }
        })
        return week;
    }

    // Tong hop thong tin gio lam
    async workingTime (month, year) {
        const ot = await this.avgOT(month, year);
        const otOnWeek = await this.otOnWeek(month, year);
        const workingTime = {
            tangcatrungbinh: ot,
            phanbotheotuan: otOnWeek,
        };
        return workingTime;
    }
}

module.exports = new Admin_User_Dashboard;