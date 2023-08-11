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
        const query_workinfo = `INSERT INTO thongtincongviec (msnv, ngaybatdau, sohdld, ngaykyhopdong, loaihopdong, luongcoban, luongcoban1h, loaihinhcongviec) VALUES ('${usr.msnv}', '${usr.ngaybatdau}', '${usr.sohdld}', '${usr.ngaykyhopdong}', '${usr.loaihopdong}', ${usr.luongcoban}, ${usr.luongcoban1h}, ${usr.loaihinhcongviec})`;
        const query_agency = `INSERT INTO chinhanh (msnv, id_chinhanh, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chinhanh}, '${usr.ngaybatdau}')`;
        const query_department = `INSERT INTO bophan (msnv, id_bophan, ngaybatdaulamviec) VALUES ('${usr.msnv}',${usr.bophan},'${usr.ngaybatdau}')`;
        const query_position = `INSERT INTO chucvu (msnv, id_chucvu, ngaybatdaulamviec) VALUES ('${usr.msnv}', ${usr.chucvu}, '${usr.ngaybatdau}')`;
        (await db).query(query_account);
        (await db).query(query_userinfo);
        (await db).query(query_avt);
        (await db).query(query_workinfo);
        (await db).query(query_agency);
        (await db).query(query_department);
        (await db).query(query_position);
        const data = (await db).execute(`SELECT thongtincanhan.hoten, taikhoan.msnv FROM taikhoan join thongtincanhan on taikhoan.msnv = thongtincanhan.msnv WHERE sdt = '${usr.sdt}'`);
        return (data.then((data) => {return data[0][0]}));
    }

    // Lay danh sach nhan vien
    async showStaff () {
        const db = this.connection();
        const query = 'SELECT tk.msnv, ttcn.hoten, dscn.tenchinhanh FROM ((taikhoan tk LEFT JOIN thongtincanhan ttcn ON tk.msnv = ttcn.msnv) JOIN thongtincongviec ttcv ON tk.msnv = ttcv.msnv) JOIN danhsachchinhanh dscn ON ttcv.chinhanh = dscn.id_chinhanh;'
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
        const info = 'ttcv.ngaybatdau, ttcv.sohdld, ttcv.ngaykyhopdong, ttcv.loaihopdong, ttcv.soBHXH, ttcv.soBHYT, ttcv.noidkkcb, ttcv.tyledongbaohiem, ttcv.luongcoban, lhcv.tenloaihinhcongviec, cn.tenchinhanh, bp.tenbophan, cv.tenchucvu';
        const selectfrom = '(((thongtincongviec ttcv JOIN loaihinhcongviec lhcv ON ttcv.loaihinhcongviec = lhcv.id_loaihinhcongviec) JOIN danhsachchinhanh cn ON ttcv.chinhanh = cn.id_chinhanh) JOIN danhsachbophan bp ON ttcv.bophan = bp.id_bophan) JOIN danhsachchucvu cv ON ttcv.chucvu = cv.id_chucvu';
        const query = `SELECT ${info} FROM ${selectfrom} WHERE ttcv.msnv = '${msnv}'`;
        const data =  (await db).execute(query);
        return data.then((data) => {return data[0][0]});
    }
}

module.exports = new Admin_Services;