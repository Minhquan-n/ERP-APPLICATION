const config = require('../config');
const database = require('../mysql/database.connect');

class Staff_Servieces {
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Kiem tra so dien thoai da ton tai
    async verify_phone (sdt) {
        const db = this.connection();
        const data = (await db).execute(`SELECT sdt FROM taikhoan WHERE sdt = '${sdt}'`);
        const checkPhone = data.then((data) => {return data[0][0]});
        return checkPhone;
    }

    // Kiem tra email da ton tai
    async verify_email (email) {
        const db = this.connection();
        const data = (await db).execute(`SELECT email FROM taikhoan WHERE email = '${email}'`);
        const checkEmail = data.then((data) => {return data[0][0]});
        return checkEmail;
    }

    // Lay so gio lam viec trong thang cua loai hinh cong viec
    async getWorkingHours (id) {
        const db = this.connection();
        const data = (await db).execute(`SELECT sogiolamviec FROM loaihinhcongviec WHERE id_loaihinhcongviec = ${id}`);
        const workinghours = data.then((data) => {return data[0][0].sogiolamviec});
        return workinghours;
    }

    //Tao thong tin dang nhap
    extractpayload_login (payload) {
        const account = {
            msnv: payload.msnv,
            matkhau:payload.matkhau
        }
        return account;
    }

    // Kiem tra mat khau dang nhap
    async login (payload) {
        const db = this.connection();
        const usr = this.extractpayload_login(payload);
        const info = 'tk.msnv, tk.matkhau, tk.isAdmin, tk.trangthai_taikhoan, ttcn.hoten';
        const query = `SELECT ${info} FROM taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv WHERE tk.msnv = '${usr.msnv}'`;
        const data = (await db).execute(query);
        return (data.then((data) => {return data[0][0]}));
    }
}

module.exports = new Staff_Servieces;