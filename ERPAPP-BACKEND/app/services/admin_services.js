const config = require('../config');
const database = require('../mysql/database.connect');

class Admin_Services {
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Lay thong tin tai khoan
    extractpayload_createUser (payload) {
        const newusr = {
            msnv: payload.msnv,
            sdt: payload.sdt,
            email: payload.email,
            matkhau: payload.matkhau,
            hoten: payload.hoten,
            avt_secure_url: payload.avt_secure_url,
            avt_public_id: payload.avt_public_id,
            avt_format: payload.avt_format,
            ngaybatdau: payload.ngaykyhopdong,
            sohdld: payload.sohdld,
            ngaykyhopdong: payload.ngaykyhopdong,
            loaihopdong: payload.loaihopdong,
            luongcoban: payload.luongcoban,
            luongcoban1h: payload.luongcoban1h,
            loaihinhcongviec: payload.loaihinhcongviec,
            chinhanh: payload.chinhanh,
            bophan: payload.bophan,
            chucvu: payload.chucvu
        };
        return newusr;
    }

    // Lay so luong nhan vien hien tai cua doanh nghiep
    async getStaffAmount () {
        const db = this.connection();
        const query = 'SELECT soluongnhanvien FROM doanhnghiep WHERE msdn = "2805514562"';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0].soluongnhanvien});
    }

    // Cap nhat so luong nhan vien cua doanh nghiep
    async updateStaffAmount (num) {
        const db = this.connection();
        const query = `UPDATE doanhnghiep SET soluongnhanvien = ${num} where msdn = '2805514562'`;
        (await db).query(query);
        return 'Success';
    }

    // Tao tai khoan cho nguoi dung moi
    async createUser (payload) {
        const usr = this.extractpayload_createUser(payload);
        const db = this.connection();
        const query_account = `INSERT INTO taikhoan (msnv, sdt, email, matkhau) VALUES ('${usr.msnv}','${usr.sdt}','${usr.email}','${usr.matkhau}')`;
        const query_userinfo = `INSERT INTO thongtincanhan (msnv, hoten) VALUES ('${usr.msnv}','${usr.hoten}')`;
        const query_avt = `INSERT INTO anhdaidien (msnv, avt_secure_url, avt_public_id, avt_format) VALUES ('${usr.msnv}', '${usr.avt_secure_url}', '${usr.avt_public_id}', '${usr.avt_format}')`;
        const query_workinfo = `INSERT INTO thongtincongviec (msnv, ngaybatdau, luongcoban, luongcoban1h, loaihinhcongviec) VALUES ('${usr.msnv}', '${usr.ngaybatdau}', ${usr.luongcoban}, ${usr.luongcoban1h}, ${usr.loaihinhcongviec})`;
        const query_laborcontract = `INSERT INTO hopdonglaodong (msnv, sohdld, ngaykyhopdong, loaihopdong) VALUES ('${usr.msnv}', '${usr.sohdld}', '${usr.ngaykyhopdong}', '${usr.loaihopdong}')`;
        const query_agency = `INSERT INTO chinhanh (msnv, id_chinhanh, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chinhanh}, '${usr.ngaybatdau}')`;
        const query_department = `INSERT INTO bophan (msnv, id_bophan, ngaybatdaulamviec) VALUES ('${usr.msnv}',${usr.bophan},'${usr.ngaybatdau}')`;
        const query_position = `INSERT INTO chucvu (msnv, id_chucvu, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chucvu}, '${usr.ngaybatdau}')`;
        (await db).query(query_account);
        (await db).query(query_userinfo);
        (await db).query(query_avt);
        (await db).query(query_workinfo);
        (await db).query(query_laborcontract);
        (await db).query(query_agency);
        (await db).query(query_department);
        (await db).query(query_position);
        const data = (await db).execute(`SELECT thongtincanhan.hoten, taikhoan.msnv FROM taikhoan join thongtincanhan on taikhoan.msnv = thongtincanhan.msnv WHERE sdt = '${usr.sdt}'`);
        return (data.then((data) => {return data[0][0]}));
    }

    // Cap nhat trang thai admin cho tai khoan quan tri vien
    async updateIsAdmin (msnv) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET isAdmin = 1 WHERE msnv = '${msnv}'`;
        (await db).query(query);
        return 1;
    }

    // Lay danh sach nhan vien
    async showStaff () {
        const db = this.connection();
        const query = 'SELECT tk.msnv, ttcn.hoten, dscn.tenchinhanh FROM ((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN chinhanh cn ON tk.msnv = cn.msnv) JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh WHERE cn.trangthai = 1'
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
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

module.exports = new Admin_Services;