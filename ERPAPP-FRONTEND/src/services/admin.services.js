import CreateApiService from './api_service'

class Service {
    constructor (baseUrl = '/api/erpapp') {
        this.api = CreateApiService(baseUrl);
    }

    // Cac dich vu cua admin
    // Cac dich vu thao tac tren tai khoan nguoi dung
    async showStaff () {
        return (await this.api.get('/usr')).data;
    }

    async createUser (data) {
        return (await this.api.post('/usr', data)).data;
    }

    async searchUser (data) {
        return (await this.api.put('/usr', data)).data;
    }

    async showUserInfo (id) {
        return (await this.api.get(`/usr/${id}`)).data;
    }

    async resetPass (id) {
        return (await this.api.post(`/usr/${id}`)).data;
    }

    async updateUser (id, data) {
        return (await this.api.put(`/usr/${id}`, data)).data;
    }

    // Cac dich vu thao tac voi cac du lieu danh muc
    async getEthnicList () {
        return (await this.api.get('/data/ethniclist')).data;
    }

    async getProvinceList () {
        return (await this.api.get('/data/provincelist')).data;
    }

    async getDistrictList (data) {
        return (await this.api.get('/data/districtlist', data)).data;
    }

    async getWardList (data) {
        return (await this.api.get('/data/wardlist', data)).data;
    }

    async getOfficeList () {
        return (await this.api.get('/data/branch')).data;
    }

    async searchOffice (data) {
        return (await this.api.put('/data/branch', data)).data;
    }

    async getAreaList () {
        return (await this.api.get('/data/department')).data;
    }

    async searchArea (data) {
        return (await this.api.put('/data/department', data)).data;
    }
    async getPositionList () {
        return (await this.api.get('/data/position')).data;
    }

    async searchPosition (data) {
        return (await this.api.put('/data/position', data)).data;
    }
}

export default new Service();