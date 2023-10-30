const config = require('../../../config');
const database = require('../../../mysql/database.connect');

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

    // Lay so luong nhan vien theo chi nhanh
    async getUserOnBranch () {
        const db = this.connection();
        const query = 'SELECT COUNT(*) AS soluongnhanvien, dscn.tenchinhanh FROM taikhoan tk JOIN (chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) ON tk.msnv = cn.msnv WHERE cn.trangthai = 1 AND tk.trangthai_taikhoan = 1 GROUP BY cn.id_chinhanh;'
        const data = (await db).execute(query);
        return data.then((data) => {
            return data[0];
        })
    }

    // Tong hop cac thong tin
    async overview () {
        const allUser = await this.getAllUser();
        const userOnBranch = await this.getUserOnBranch();
        const overview = {
            tongnhanvien: allUser,
            chinhanh: userOnBranch,
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
    async avgOT () {
        const today = new Date();
        const month = (today.getMonth() === 0) ? 12 : today.getMonth();
        const year = (today.getMonth() === 0) ? today.getFullYear - 1 : today.getFullYear();
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
}

module.exports = new Admin_User_Dashboard;