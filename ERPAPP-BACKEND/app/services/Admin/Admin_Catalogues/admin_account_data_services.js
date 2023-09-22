const config = require('../../../config');
const database = require('../../../mysql/database.connect');

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

    // Cac services tren data chi nhanh
    // Lay danh sach chi nhanh
    async getBranchList () {
        const db = this.connection();
        const select = 'cn.id_chinhanh, cn.tenchinhanh, cn.dccn_sonha, cn.dccn_phuongxa, cn.dccn_quanhuyen, cn.dccn_tinhthanh, tt.tentinhthanh, qh.tenquanhuyen, px.tenphuongxa';
        const table = '((danhsachchinhanh cn JOIN tinhthanh tt ON cn.dccn_tinhthanh = tt.id_tinhthanh) JOIN quanhuyen qh ON cn.dccn_quanhuyen = qh.id_quanhuyen AND cn.dccn_tinhthanh = qh.id_tinhthanh) JOIN phuongxa px ON cn.dccn_phuongxa = px.id_phuongxa AND cn.dccn_tinhthanh = px.id_tinhthanh AND cn.dccn_quanhuyen = px.id_quanhuyen'
        const query = `SELECT ${select} FROM ${table}`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay thong tin them chi nhanh
    extractBranch (payload) {
        const branch = {
            tenchinhanh: payload.tenchinhanh,
            dccn_sonha: payload.sonha,
            dccn_tinhthanh: payload.tinhthanh,
            dccn_quanhuyen: payload.quanhuyen,
            dccn_phuongxa: payload.phuongxa
        };
        return branch;
    }

    // Them chi nhanh
    async addBranch (payload) {
        const db = this.connection();
        const branch = this.extractBranch(payload);
        const query = `INSERT INTO danhsachchinhanh (tenchinhanh, dccn_sonha, dccn_tinhthanh, dccn_quanhuyen, dccn_phuongxa) VALUES ('${branch.tenchinhanh}', '${branch.dccn_sonha}', '${branch.dccn_tinhthanh}', '${branch.dccn_quanhuyen}', ${branch.dccn_phuongxa})`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Cap nhat chi nhanh
    async updateBranch (id, payload) {
        const db = this.connection();
        const branch = this.extractBranch(payload);
        const query = `UPDATE danhsachchinhanh SET tenchinhanh = '${branch.tenchinhanh}', dccn_sonha = '${branch.dccn_sonha}', dccn_tinhthanh = '${branch.dccn_tinhthanh}', dccn_quanhuyen = '${branch.dccn_quanhuyen}', dccn_phuongxa = ${branch.dccn_phuongxa} WHERE id_chinhanh = ${id}`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Tim kiem chi nhanh
    async searchBranch (key) {
        const db = this.connection();
        const select = 'cn.id_chinhanh, cn.tenchinhanh, cn.dccn_sonha, cn.dccn_phuongxa, cn.dccn_quanhuyen, cn.dccn_tinhthanh, tt.tentinhthanh, qh.tenquanhuyen, px.tenphuongxa';
        const table = '((danhsachchinhanh cn JOIN tinhthanh tt ON cn.dccn_tinhthanh = tt.id_tinhthanh) JOIN quanhuyen qh ON cn.dccn_quanhuyen = qh.id_quanhuyen AND cn.dccn_tinhthanh = qh.id_tinhthanh) JOIN phuongxa px ON cn.dccn_phuongxa = px.id_phuongxa AND cn.dccn_tinhthanh = px.id_tinhthanh AND cn.dccn_quanhuyen = px.id_quanhuyen'
        const query = `SELECT ${select} FROM ${table} WHERE cn.tenchinhanh LIKE '%${key}%'`;
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Lay danh sach bo phan
    async getDepartmentList () {
        const db = this.connection();
        const query = 'SELECT * FROM danhsachbophan';
        const data = (await db).execute(query);
        return data.then((data) => {return data[0]});
    }

    // Them bo phan
    async addDepartment (tenbp) {
        var success = false;
        const db = this.connection();
        const query = `INSERT INTO danhsachbophan (tenbophan) VALUES ('${tenbp}')`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Cap nhat bo phan
    async updateDepartment (id, tenbp) {
        const db = this.connection();
        const query = `UPDATE danhsachbophan SET tenbophan = '${tenbp}' WHERE id_bophan = ${id}`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Tim kiem bo phan
    async searchDepartment (key) {
        const db = this.connection();
        const query = `SELECT * FROM danhsachbophan WHERE tenbophan LIKE '%${key}%'`;
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

    // Them chuc vu
    async addPosition (tencv) {
        const db = this.connection();
        const query = `INSERT INTO danhsachchucvu (tenchucvu) VALUES ('${tencv}')`
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Cap nhat chuc vu
    async updatePosition (id, tencv) {
        const db = this.connection();
        const query = `UPDATE danhsachchucvu SET tenchucvu = '${tencv}' WHERE id_chucvu = ${id}`;
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
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