const config = require('../../config');
const database = require('../../mysql/database.connect');

class Admin_Services {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Tong hop thong tin tai khoan
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
        const query_userinfo = `INSERT INTO thongtincanhan (msnv, hoten, dantoc, dclh_tinhthanh, dclh_quanhuyen, dclh_phuongxa) VALUES ('${usr.msnv}','${usr.hoten}', 0, '000', '000', 0)`;
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

    // Lay danh sach nhan vien
    async getUserList () {
        const db = this.connection();
        const table = '(((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN chinhanh cn ON tk.msnv = cn.msnv) JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) JOIN anhdaidien avt ON tk.msnv = avt.msnv';
        const query = `SELECT tk.msnv, ttcn.hoten, dscn.tenchinhanh, avt.avt_secure_url FROM ${table} WHERE cn.trangthai = 1 AND avt.avt_status = 1 AND cn.trangthai = 1 ORDER BY tk.msnv`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach nhan vien theo tu khoa tim kiem
    async getSearch (key) {
        const db = this.connection();
        const table = '(((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN chinhanh cn ON tk.msnv = cn.msnv) JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) JOIN anhdaidien avt ON tk.msnv = avt.msnv';
        const query = `SELECT tk.msnv, ttcn.hoten, dscn.tenchinhanh, avt.avt_secure_url FROM ${table} WHERE cn.trangthai = 1 AND avt.avt_status = 1 AND cn.trangthai = 1 AND ${key} ORDER BY tk.msnv;`
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tong hop thong tin cap nhat thong tin cong viec cho nhan vien
    extractpayload_UpdateUser (payload) {
        const work_info = {
            soBHXH: payload.soBHXH,
            soBHYT: payload.soBHYT,
            noidkkcb: payload.noidkkcb,
            tyledongbaohiem: payload.tyledongbaohiem,
            luongcoban: payload.luongcoban,
            luongcoban1h: payload.luongcoban1h,
            phepnam: payload.phepnam,
            loaihinhcongviec: payload.loaihinhcongviec,
            sohdld: payload.sohdld,
            ngaykyhopdong: payload.ngaykyhopdong,
            loaihopdong: payload.loaihopdong,
            id_chinhanh: payload.id_chinhanh,
            id_bophan: payload.id_bophan,
            id_chucvu: payload.id_chucvu,
            ngaybatdaulamviec: payload.ngaybatdaulamviec
        };
        return work_info;
    }

    // Cap nhat thong tin cong viec nhan vien 
    async updateUserWorkInfo (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_UpdateUser(payload);
        const query = `UPDATE thongtincongviec SET soBHXH = '${info.soBHXH}', soBHYT = '${info.soBHYT}', noidkkcb = '${info.noidkkcb}', tyledongbaohiem = ${info.tyledongbaohiem}, luongcoban = ${info.luongcoban}, luongcoban1h = ${info.luongcoban1h}, phepnam = ${info.phepnam}, loaihinhcongviec = ${info.loaihinhcongviec} WHERE msnv = '${msnv}'`;
        (await db).query(query);
        return 'Success';
    }

    // Cap nhat thong tin hop dong lao dong cua nhan vien
    async updateUserLaborContract (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_UpdateUser(payload);
        const query_updateStatus = `UPDATE hopdonglaodong SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO hopdonglaodong (msnv, sohdld, ngaykyhopdong, loaihopdong) VALUES ('${msnv}', '${info.sohdld}', '${info.ngaykyhopdong}', '${info.loaihopdong}')`;
        (await db).query(query_updateStatus);
        (await db).query(query);
        return 'Success';
    }

    // Cap nhat thong tin chi nhanh lam viec cua nhan vien
    async updateUserOffice (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_UpdateUser(payload);
        const query_updateStatus = `UPDATE chinhanh SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO chinhanh (msnv, id_chinhanh, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_chinhanh}, '${info.ngaybatdaulamviec}')`;
        (await db).query(query_updateStatus);
        (await db).query(query);
        return 'Success';
    }

    // Cap nhat thong tin bo phan lam viec cua nhan vien
    async updateUserArea (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_UpdateUser(payload);
        const query_updateStatus = `UPDATE bophan SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO bophan (msnv, id_bophan, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_bophan}, '${ngaybatdaulamviec}')`;
        (await db).query(query_updateStatus);
        (await db).query(query);
        return 'Success';
    }

    // Cap nhat thong tin chuc vu lam viec cua nhan vien
    async updateUserPosition (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_UpdateUser(payload);
        const query_updateStatus = `UPDATE chucvu SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO chucvu (msnv, id_chucvu, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_chucvu}, '${info.ngaybatdaulamviec}')`
        (await db).query(query_updateStatus);
        (await db).query(query);
        return 'Success';
    }

    // Reset mat khau cho tai khoan nhan vien
    async resetPass (msnv, matkhau) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET matkhau = '${matkhau}' WHERE msnv = '${msnv}'`;
        (await db).query(query);
        return 'Success';
    }

    // Vo hieu tai khoan nguoi dung
    async disableUser (msnv) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET trangthai_taikhoan = 0 WHERE msnv = '${msnv}'`;
        (await db).query(query);
        return 'Success';
    }

    // Kich hoat lai tai khoan nguoi dung
    async enableUser (msnv) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET trangthai_taikhoan = 1 WHERE msnv = '${msnv}'`;
        (await db).query(query);
        return 'Success';
    }
}

module.exports = new Admin_Services;