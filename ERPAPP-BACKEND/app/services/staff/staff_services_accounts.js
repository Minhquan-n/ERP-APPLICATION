const config = require('../../config');
const database = require('../../mysql/database.connect');

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
        const info = 'tk.msnv, tk.matkhau, tk.trangthai_taikhoan, ttcn.hoten, bp.id_bophan';
        const query = `SELECT ${info} FROM (taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN bophan bp ON tk.msnv = bp.msnv WHERE tk.msnv = '${usr.msnv}'`;
        const data = (await db).execute(query);
        return (data.then((data) => {return data[0][0]}));
    }

    // Lay thong tin tai khoan nhan vien theo msnv
    async getUserAccountInfo (msnv) {
        const db = this.connection();
        const query = `SELECT msnv, sdt, email FROM taikhoan WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin ca nhan nhan vien theo msnv
    async getUserPersonalInfo (msnv) {
        const db = this.connection();
        const info = 'hoten, gioitinh, ngaysinh, dantoc, cccd, ngaycap_cccd, noicap_cccd, trinhdo, dclh_sonha, hoten_nguoithan, sdt_nguoithan, mqh_nguoithan';
        const query = `SELECT ${info} FROM thongtincanhan WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin cong viec
    async getUserWorkInfo (msnv) {
        const db = this.connection();
        const info = 'ttcv.ngaybatdau, ttcv.soBHXH, ttcv.soBHYT, ttcv.noidkkcb, ttcv.tyledongbaohiem, ttcv.luongcoban, lhcv.tenloaihinhcongviec';
        const selectfrom = 'thongtincongviec ttcv JOIN loaihinhcongviec lhcv ON ttcv.loaihinhcongviec = lhcv.id_loaihinhcongviec';
        const query = `SELECT ${info} FROM ${selectfrom} WHERE ttcv.msnv = '${msnv}'`;
        const data =  (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin hop dong lao dong cua nhan vien
    async getUserLaborContract (msnv) {
        const db = this.connection();
        const query = `SELECT sohdld, ngaykyhopdong, loaihopdong FROM hopdonglaodong WHERE msnv = '${msnv}' AND trangthai = 1`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin chi nhanh lam viec hien tai
    async getUserAgency (msnv) {
        const db = this.connection();
        const query = `SELECT dscn.tenchinhanh, cn.id_chinhanh FROM chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh WHERE cn.trangthai = 1 AND cn.msnv = '${msnv}'`
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin bo phan lam viec hien tai
    async getUserDepartment (msnv) {
        const db = this.connection();
        const query = `SELECT dsbp.tenbophan, bp.id_bophan FROM bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan WHERE bp.trangthai = 1 AND bp.msnv = '${msnv}'`
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin chuc vu hien tai
    async getUserPosition (msnv) {
        const db = this.connection();
        const query = `SELECT dscv.tenchucvu, cv.id_chucvu FROM chucvu cv JOIN danhsachchucvu dscv ON cv.id_chucvu = dscv.id_chucvu WHERE cv.trangthai = 1 AND cv.msnv = '${msnv}'`
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }
}

module.exports = new Staff_Servieces;