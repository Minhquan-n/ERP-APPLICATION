const config = require('../../../config');
const database = require('../../../mysql/database.connect');
const DB_Services = require('../../DB_Services/service');

class Admin_Services {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
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
        const update = await DB_Services.updateDB(query);
        return update ?  'Success' : 'Fail';
    }

    // Lay so gio lam viec trong thang cua loai hinh cong viec
    async getWorkingHours (id) {
        const db = this.connection();
        const data = (await db).execute(`SELECT sogiolamviec FROM loaihinhcongviec WHERE id_loaihinhcongviec = ${id}`);
        const workinghours = data.then((data) => {return data[0][0].sogiolamviec});
        return workinghours;
    }

    // Tong hop thong tin tai khoan
    async extractpayload_createUser (msnv, pass, payload) {
        // Lay so luong nhan vien hien tai va tao msnv moi
        const workinghours = await this.getWorkingHours(payload.loaihinhcongviec);
        const salaryOn1H = (payload.luongcoban / workinghours);
        // Tao payload thong tin 
        const newusr = {
            msnv: msnv,
            sdt: payload.sdt,
            email: payload.email,
            matkhau: pass,
            hoten: payload.hoten,
            ngaybatdau: payload.ngaykyhopdong,
            sohdld: payload.sohdld,
            ngaykyhopdong: payload.ngaykyhopdong,
            loaihopdong: payload.loaihopdong,
            luongcoban: payload.luongcoban,
            luongcoban1h: salaryOn1H,
            loaihinhcongviec: payload.loaihinhcongviec,
            chinhanh: payload.chinhanh,
            bophan: payload.bophan,
            chucvu: payload.chucvu,
            avt_secure_url: process.env.AVT_SECURE_URL,
            avt_public_id: process.env.AVT_PUBLIC_ID,
            avt_format: process.env.AVT_FORMAT,
            ngaytaotk: payload.ngaykyhopdong
        }
        return newusr;
    }

    // Tao tai khoan cho nguoi dung moi
    async createUser (msnv, pass, payload) {
        const usr = await this.extractpayload_createUser(msnv, pass, payload);
        const db = this.connection();
        const query_account = `INSERT INTO taikhoan (msnv, sdt, email, matkhau, ngaytaotk) VALUES ('${usr.msnv}','${usr.sdt}','${usr.email}','${usr.matkhau}', '${usr.ngaytaotk}')`;
        const query_userinfo = `INSERT INTO thongtincanhan (msnv, hoten, dantoc, dclh_tinhthanh, dclh_quanhuyen, dclh_phuongxa) VALUES ('${usr.msnv}','${usr.hoten}', 0, '000', '000', 0)`;
        const query_avt = `INSERT INTO anhdaidien (msnv, avt_secure_url, avt_public_id, avt_format) VALUES ('${usr.msnv}', '${usr.avt_secure_url}', '${usr.avt_public_id}', '${usr.avt_format}')`;
        const query_workinfo = `INSERT INTO thongtincongviec (msnv, ngaybatdau, luongcoban, luongcoban1h, loaihinhcongviec) VALUES ('${usr.msnv}', '${usr.ngaybatdau}', ${usr.luongcoban}, ${usr.luongcoban1h}, ${usr.loaihinhcongviec})`;
        const query_laborcontract = `INSERT INTO hopdonglaodong (msnv, sohdld, ngaykyhopdong, loaihopdong) VALUES ('${usr.msnv}', '${usr.sohdld}', '${usr.ngaykyhopdong}', '${usr.loaihopdong}')`;
        const query_agency = `INSERT INTO chinhanh (msnv, id_chinhanh, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chinhanh}, '${usr.ngaybatdau}')`;
        const query_department = `INSERT INTO bophan (msnv, id_bophan, ngaybatdaulamviec) VALUES ('${usr.msnv}',${usr.bophan},'${usr.ngaybatdau}')`;
        const query_position = `INSERT INTO chucvu (msnv, id_chucvu, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chucvu}, '${usr.ngaybatdau}')`;
        const acc = await DB_Services.insertDB(query_account);
        const usrInfo = await DB_Services.insertDB(query_userinfo);
        const avt = await DB_Services.insertDB(query_avt);
        const workInfo = await DB_Services.insertDB(query_workinfo);
        const laborContract = await DB_Services.insertDB(query_laborcontract);
        const branch = await DB_Services.insertDB(query_agency);
        const department = await DB_Services.insertDB(query_department);
        const position = await DB_Services.insertDB(query_position);
        if (!acc || !usrInfo || !avt || !workInfo || !laborContract || !branch || !department || !position) return 'Fail';
        const data = (await db).execute(`SELECT thongtincanhan.hoten, taikhoan.msnv FROM taikhoan join thongtincanhan on taikhoan.msnv = thongtincanhan.msnv WHERE sdt = '${usr.sdt}'`);
        return (data.then((data) => {return data[0][0]}));
    }

    // Lay danh sach nhan vien con hieu luc
    async getUserList () {
        const db = this.connection();
        const select = 'tk.msnv, ttcn.hoten, dscn.tenchinhanh, dsbp.tenbophan, dscv.tenchucvu, avt.avt_secure_url, tk.trangthai_taikhoan';
        const table = '((((taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN (chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh) ON tk.msnv = cn.msnv) JOIN (bophan bp JOIN danhsachbophan dsbp ON bp.id_bophan = dsbp.id_bophan) ON tk.msnv = bp.msnv) JOIN (chucvu cv JOIN danhsachchucvu dscv ON cv.id_chucvu = dscv.id_chucvu) ON tk.msnv = cv.msnv) JOIN anhdaidien avt ON tk.msnv = avt.msnv';
        const query = `SELECT ${select} FROM ${table} WHERE cn.trangthai = 1 AND avt.avt_status = 1 AND bp.trangthai = 1 AND cv.trangthai = 1 ORDER BY tk.msnv`;
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

    // Lay thong tin cap nhat thong tin cong viec cho nhan vien
    async extractpayload_UpdateUser (payload) {
        const workinghours = await this.getWorkingHours(payload.loaihinhcongviec);
        const salaryOn1H = (payload.luongcoban / workinghours);
        const work_info = {
            soBHXH: payload.soBHXH,
            soBHYT: payload.soBHYT,
            noidkkcb: payload.noidkkcb,
            luongcoban: payload.luongcoban,
            luongcoban1h: salaryOn1H,
            phepnam: payload.phepnam,
            loaihinhcongviec: payload.loaihinhcongviec
        }
        return work_info;
    }

    // Cap nhat thong tin cong viec nhan vien 
    async updateUserWorkInfo (msnv, payload) {
        const info = await this.extractpayload_UpdateUser(payload);
        const query = `UPDATE thongtincongviec SET soBHXH = '${info.soBHXH}', soBHYT = '${info.soBHYT}', noidkkcb = '${info.noidkkcb}', luongcoban = ${info.luongcoban}, luongcoban1h = ${info.luongcoban1h}, phepnam = ${info.phepnam}, loaihinhcongviec = ${info.loaihinhcongviec} WHERE msnv = '${msnv}'`;
        const update = await DB_Services.updateDB(query);
        return update ? true : false;
    }

    // Lay thong tin cap nhat hop dong
    extractpayload_updateLaborContract (payload) {
        const labor = {
            sohdld: payload.sohdld,
            ngaykyhopdong: payload.ngaykyhopdong,
            loaihopdong: payload.loaihopdong
        }
        return labor;
    }

    // Cap nhat thong tin hop dong lao dong cua nhan vien
    async updateUserLaborContract (msnv, payload) {
        const info = this.extractpayload_updateLaborContract(payload);
        const query_updateStatus = `UPDATE hopdonglaodong SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO hopdonglaodong (msnv, sohdld, ngaykyhopdong, loaihopdong) VALUES ('${msnv}', '${info.sohdld}', '${info.ngaykyhopdong}', '${info.loaihopdong}')`;
        const update_status = await DB_Services.updateDB(query_updateStatus);
        const insert = await DB_Services.insertDB(query);
        if (!update_status || !insert) return false;
        return true;
    }

    // Lay thong tin cap nhat chi nhanh
    extractpayload_UpdateUserBranch (payload) {
        const branch = {
            id_chinhanh: payload.chinhanh,
            ngaybatdaulamviec: payload.ngaybatdaulamviec
        };
        return branch;
    }

    // Cap nhat thong tin chi nhanh lam viec cua nhan vien
    async updateUserBranch (msnv, payload) {
        const info = this.extractpayload_UpdateUserBranch(payload);
        const query_updateStatus = `UPDATE chinhanh SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO chinhanh (msnv, id_chinhanh, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_chinhanh}, '${info.ngaybatdaulamviec}')`;
        const update_status = await DB_Services.updateDB(query_updateStatus);
        const insert = await DB_Services.insertDB(query);
        if (!update_status || !insert) return false;
        return true;
    }

    // Lay thong tin cap nhat bo phan
    extractpayload_UpdateUserDepartment (payload) {
        const department = {
            id_bophan: payload.bophan,
            ngaybatdaulamviec: payload.ngaybatdaulamviec
        };
        return department;
    }

    // Cap nhat thong tin bo phan lam viec cua nhan vien
    async updateUserDepartment (msnv, payload) {
        const info = this.extractpayload_UpdateUserDepartment(payload);
        const query_updateStatus = `UPDATE bophan SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO bophan (msnv, id_bophan, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_bophan}, '${ngaybatdaulamviec}')`;
        const update_status = await DB_Services.updateDB(query_updateStatus);
        const insert = await DB_Services.insertDB(query);
        if (!update_status || !insert) return false;
        return true;
    }

    // Lay thong tin cap nhat chi nhanh
    extractpayload_UpdateUserPosition (payload) {
        const position = {
            id_chucvu: payload.chucvu,
            ngaybatdaulamviec: payload.ngaybatdaulamviec
        };
        return position;
    }

    // Cap nhat thong tin chuc vu lam viec cua nhan vien
    async updateUserPosition (msnv, payload) {
        // const db = this.connection();
        const info = this.extractpayload_UpdateUserPosition(payload);
        const query_updateStatus = `UPDATE chucvu SET trangthai = 0 WHERE msnv = '${msnv}'`;
        const query = `INSERT INTO chucvu (msnv, id_chucvu, ngaybatdaulamviec) VALUES ('${msnv}', ${info.id_chucvu}, '${info.ngaybatdaulamviec}')`
        const update_status = await DB_Services.updateDB(query_updateStatus);
        const insert = await DB_Services.insertDB(query);
        if (!update_status || !insert) return false;
        return true;
    }

    // Reset mat khau cho tai khoan nhan vien
    async resetPass (msnv, matkhau) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET matkhau = '${matkhau}' WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Vo hieu tai khoan nguoi dung
    async disableUser (msnv) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET trangthai_taikhoan = 0 WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Kich hoat lai tai khoan nguoi dung
    async enableUser (msnv) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET trangthai_taikhoan = 1 WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }
}

module.exports = new Admin_Services;