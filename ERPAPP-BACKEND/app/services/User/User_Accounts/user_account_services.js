const xlsx = require('xlsx');
const path = require('path');

const config = require('../../../config');
const database = require('../../../mysql/database.connect');
const DB_Services = require('../../DB_Services/service');

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

    //Lay thong tin dang nhap tu payload
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
        const info = 'tk.msnv, tk.matkhau, tk.trangthai_taikhoan, ttcn.hoten, bp.id_bophan, tk.badlogin';
        const query = `SELECT ${info} FROM (taikhoan tk JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN bophan bp ON tk.msnv = bp.msnv WHERE tk.msnv = '${usr.msnv}'`;
        const data = (await db).execute(query);
        return (data.then((data) => {return data[0][0]}));
    }

    // Cap nhat so lan dang nhap sai
    async updateBadLogin (msnv,num) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET badlogin = ${num} WHERE msnv = '${msnv}'`;
        const update = await DB_Services.updateDB(query);
        return update ? true : false;
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
        const info = 'ttcn.hoten, ttcn.gioitinh, ttcn.ngaysinh, ttcn.dantoc, ttcn.cccd, ttcn.ngaycap_cccd, ttcn.noicap_cccd, ttcn.trinhdo, ttcn.stk, ttcn.tentk, ttcn.tenNH, ttcn.dclh_sonha, ttcn.dclh_tinhthanh, ttcn.dclh_quanhuyen, ttcn.dclh_phuongxa, ttcn.hoten_nguoithan, ttcn.sdt_nguoithan, ttcn.mqh_nguoithan, tt.tentinhthanh, qh.tenquanhuyen, px.tenphuongxa, dt.tendantoc';
        const table = '(((thongtincanhan ttcn JOIN dantoc dt ON ttcn.dantoc = dt.id_dantoc) JOIN tinhthanh tt ON ttcn.dclh_tinhthanh = tt.id_tinhthanh) JOIN quanhuyen qh ON ttcn.dclh_quanhuyen = qh.id_quanhuyen AND ttcn.dclh_tinhthanh = qh.id_tinhthanh) JOIN phuongxa px ON ttcn.dclh_phuongxa = px.id_phuongxa AND ttcn.dclh_tinhthanh = px.id_tinhthanh AND ttcn.dclh_quanhuyen = px.id_quanhuyen'
        const query = `SELECT ${info} FROM ${table} WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin cong viec
    async getUserWorkInfo (msnv) {
        const db = this.connection();
        const info = 'ttcv.ngaybatdau, ttcv.soBHXH, ttcv.soBHYT, ttcv.noidkkcb, ttcv.khautruBHXH, ttcv.khautruBHYT, ttcv.khautruBHTN, ttcv.luongcoban, ttcv.luongcoban1h, ttcv.loaihinhcongviec, ttcv.phepnam, lhcv.tenloaihinhcongviec';
        const select = 'thongtincongviec ttcv JOIN loaihinhcongviec lhcv ON ttcv.loaihinhcongviec = lhcv.id_loaihinhcongviec';
        const query = `SELECT ${info} FROM ${select} WHERE ttcv.msnv = '${msnv}'`;
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
    async getUserOffice (msnv) {
        const db = this.connection();
        const query = `SELECT dscn.tenchinhanh, cn.id_chinhanh FROM chinhanh cn JOIN danhsachchinhanh dscn ON cn.id_chinhanh = dscn.id_chinhanh WHERE cn.trangthai = 1 AND cn.msnv = '${msnv}'`
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin bo phan lam viec hien tai
    async getUserArea (msnv) {
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

    // Lay thong tin anh dai dien cua nguoi dung
    async getUserAvt (msnv) {
        const db = this.connection();
        const query = `SELECT avt_secure_url, avt_public_id, avt_format FROM anhdaidien WHERE msnv = '${msnv}' AND avt_status = 1`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay thong tin cap nhat tai khoan tu payload
    extractpayload_updateUserInfo (payload) {
        const info = {
            hoten: payload.hoten,
            gioitinh: payload.gioitinh,
            ngaysinh: payload.ngaysinh,
            dantoc: payload.dantoc,
            cccd: payload.cccd,
            ngaycap_cccd: payload.ngaycap_cccd,
            noicap_cccd: payload.noicap_cccd,
            trinhdo: payload.trinhdo,
            stk: payload.stk,
            tenNH: payload.tenNH,
            tentk: payload.tentk,
            dclh_sonha: payload.dclh_sonha,
            dclh_tinhthanh: payload.dclh_tinhthanh,
            dclh_quanhuyen: payload.dclh_quanhuyen,
            dclh_phuongxa: payload.dclh_phuongxa,
            hoten_nguoithan: payload.hoten_nguoithan,
            sdt_nguoithan: payload.sdt_nguoithan,
            mqh_nguoithan: payload.mqh_nguoithan
        }
        return info;
    }

    // Lay thong tin tai khoan
    extractpayload_updateUserAcc (payload) {
        const acc = {
            sdt: payload.sdt,
            email: payload.email
        }
        return acc;
    }

    // Lay thong tin cap nhat anh dai dien tu payload
    extractpayload_update_avt (payload) {
        const avt = {
            avt_secure_url: payload.avt_secure_url,
            avt_public_id: payload.avt_public_id,
            avt_format: payload.avt_format
        }
        return avt;
    }

    // Cap nhat thong tin tai khoan
    async updateUserAcc (msnv, payload) {
        const db = this.connection();
        const acc = this.extractpayload_updateUserAcc(payload);
        const info_account = `sdt = '${acc.sdt}', email = '${acc.email}'`;
        const query = `UPDATE taikhoan SET ${info_account} WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Cap nhat thong tin ca nhan
    async updateUserInfo (msnv, payload) {
        const db = this.connection();
        const info = this.extractpayload_updateUserInfo(payload);
        const info_user = `hoten = '${info.hoten}', gioitinh = '${info.gioitinh}', ngaysinh = '${info.ngaysinh}', dantoc = '${info.dantoc}', cccd = '${info.cccd}', ngaycap_cccd = '${info.ngaycap_cccd}', noicap_cccd = '${info.noicap_cccd}', trinhdo = '${info.trinhdo}', stk = '${info.stk}', tenNH = '${info.tenNH}', tentk = '${info.tentk}', dclh_sonha = '${info.dclh_sonha}', dclh_tinhthanh = '${info.dclh_tinhthanh}', dclh_quanhuyen = '${info.dclh_quanhuyen}', dclh_phuongxa = '${info.dclh_phuongxa}', hoten_nguoithan = '${info.hoten_nguoithan}', sdt_nguoithan = '${info.sdt_nguoithan}', mqh_nguoithan = '${info.mqh_nguoithan}'`;
        const query = `UPDATE thongtincanhan SET ${info_user} WHERE msnv = '${msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Cap nhat anh dai dien tai khoan
    async updateAvt (msnv, payload) {
        const db = this.connection();
        const avt = this.extractpayload_update_avt(payload);
        const query = `INSERT INTO anhdaidien (msnv, avt_secure_url, avt_public_id, avt_format) VALUES ('${msnv}', '${avt.avt_secure_url}', '${avt.avt_public_id}', '${avt.avt_format}')`;
        // Thay doi trang thai cua avt hien thoi
        (await db).query(`UPDATE anhdaidien SET avt_status = 0 WHERE msnv = '${msnv}'`);
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Doi mat khau tai khoan
    async changePass (payload) {
        const db = this.connection();
        const query = `UPDATE taikhoan SET matkhau = '${payload.matkhaumoi}' WHERE msnv = '${payload.msnv}'`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        })
    }

    // Lay bang luong hien tai
    async getPaysheet (msnv, id_dotluong) {
        const db = this.connection();
        const select = 'blnv.msnv, blnv.id_bangluong, blnv.id_dotluong, blnv.trangthai, blnv.sogiolam, blnv.sogiotangca, blnv.BHXH, blnv.BHYT, blnv.BHTN, blnv.luongtangca, blnv.thuong, blnv.thuclanh, blnv.ghichu, ttcv.luongcoban, ttcn.hoten, lhcv.sogiolamviec';
        const table = '((bangluongnhanvien blnv JOIN thongtincanhan ttcn ON blnv.msnv = ttcn.msnv) JOIN thongtincongviec ttcv ON blnv.msnv = ttcv.msnv) JOIN loaihinhcongviec lhcv ON ttcv.loaihinhcongviec = lhcv.id_loaihinhcongviec';
        const query = `SELECT ${select} FROM ${table} WHERE blnv.msnv = '${msnv}' AND blnv.id_dotluong = '${id_dotluong}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }

    // Lay bang cham cong theo thang
    async getTimesheet (msnv, month, path) {
        const wb = xlsx.readFile(path);
        const ws = wb.Sheets[`${month}`];
        const timesheet = xlsx.utils.sheet_to_json(ws, {header: 2});
        var usrTimesheet;
        timesheet.forEach(element => {
            if (element.MSNV === msnv) usrTimesheet = element;
        });
        return usrTimesheet;
    }
}

module.exports = new Staff_Servieces;