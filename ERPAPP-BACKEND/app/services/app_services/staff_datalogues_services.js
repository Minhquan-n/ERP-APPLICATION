const config = require('../../config');
const database = require('../../mysql/database.connect');

class Staff_Datalogues  {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Lay danh sach dan toc
    async getEthnic () {
        const db = this.connection();
        const query = 'SELECT * FROM dantoc';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach tinh thanh
    async getProvinceList () {
        const db = this.connection();
        const query = 'SELECT id_tinhthanh, tentinhthanh FROM tinhthanh ORDER BY stt';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach quan huyen
    async getDistrictList (id_tinhthanh) {
        const db = this.connection();
        const query = `SELECT id_quanhuyen, tenquanhuyen FROM quanhuyen WHERE id_tinhthanh = '${id_tinhthanh}' ORDER BY stt`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach phuong xa
    async getWardList (id_tinhthanh, id_quanhuyen) {
        const db = this.connection();
        const query = `SELECT id_phuongxa, tenphuongxa FROM phuongxa WHERE id_tinhthanh = '${id_tinhthanh}' AND id_quanhuyen = '${id_quanhuyen}'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach chi nhanh
    async getOfficeList () {
        const db = this.connection();
        const select = 'cn.id_chinhanh, cn.tenchinhanh, cn.dccn_sonha, cn.dccn_phuongxa, cn.dccn_quanhuyen, cn.dccn_tinhthanh, tt.tentinhthanh, qh.tenquanhuyen, px.tenphuongxa';
        const table = '((danhsachchinhanh cn JOIN tinhthanh tt ON cn.dccn_tinhthanh = tt.id_tinhthanh) JOIN quanhuyen qh ON cn.dccn_quanhuyen = qh.id_quanhuyen AND cn.dccn_tinhthanh = qh.id_tinhthanh) JOIN phuongxa px ON cn.dccn_phuongxa = px.id_phuongxa AND cn.dccn_tinhthanh = px.id_tinhthanh AND cn.dccn_quanhuyen = px.id_quanhuyen'
        const query = `SELECT ${select} FROM ${table}`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach bo phan
    async getAreaList () {
        const db = this.connection();
        const query = 'SELECT * FROM danhsachbophan';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach chuc vu
    async getPositionList () {
        const db = this.connection();
        const query = 'SELECT * FROM danhsachchucvu';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tim kiem chi nhanh
    async searchOffice (key) {
        const db = this.connection();
        const select = 'cn.id_chinhanh, cn.tenchinhanh, cn.dccn_sonha, cn.dccn_phuongxa, cn.dccn_quanhuyen, cn.dccn_tinhthanh, tt.tentinhthanh, qh.tenquanhuyen, px.tenphuongxa';
        const table = '((danhsachchinhanh cn JOIN tinhthanh tt ON cn.dccn_tinhthanh = tt.id_tinhthanh) JOIN quanhuyen qh ON cn.dccn_quanhuyen = qh.id_quanhuyen AND cn.dccn_tinhthanh = qh.id_tinhthanh) JOIN phuongxa px ON cn.dccn_phuongxa = px.id_phuongxa AND cn.dccn_tinhthanh = px.id_tinhthanh AND cn.dccn_quanhuyen = px.id_quanhuyen'
        const query = `SELECT ${select} FROM ${table} WHERE cn.tenchinhanh LIKE '%${key}%'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tim kiem bo phan
    async searchArea (key) {
        const db = this.connection();
        const query = `SELECT * FROM danhsachbophan WHERE tenbophan LIKE '%${key}%'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Tim kiem chuc vu
    async searchPosition (key) {
        const db = this.connection();
        const query = `SELECT * FROM danhsachchucvu WHERE tenchucvu LIKE '%${key}%'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }
}

module.exports = new Staff_Datalogues;