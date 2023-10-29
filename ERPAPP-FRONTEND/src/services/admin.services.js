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

    async enableUser (id) {
        return (await this.api.patch(`/usr/${id}`)).data;
    }
    
    async disableUser (id) {
        return (await this.api.delete(`/usr/${id}`)).data;
    }

    // Cac dich vu thao tac voi cac du lieu danh muc
    async getEthnicList () {
        return (await this.api.get('/data/ethniclist')).data;
    }

    async getProvinceList () {
        return (await this.api.get('/data/provincelist')).data;
    }

    async getDistrictList (data) {
        return (await this.api.put('/data/districtlist', data)).data;
    }

    async getWardList (data) {
        return (await this.api.put('/data/wardlist', data)).data;
    }

    async getBranchList () {
        return (await this.api.get('/data/branch')).data;
    }

    async getBranch (id) {
        return (await this.api.get(`/data/branch/${id}`)).data;
    }

    async addBranch (data) {
        return (await this.api.post('/data/branch', data)).data;
    }

    async updateBranch (id, data) {
        return (await this.api.post(`/data/branch/${id}`, data)).data;
    }

    async searchBranch (data) {
        return (await this.api.patch('/data/branch', data)).data;
    }

    async getDepartmentList () {
        return (await this.api.get('/data/department')).data;
    }

    async addDepartment (data) {
        return (await this.api.post('/data/department', data)).data;
    }

    async updateDepartment (data) {
        return (await this.api.put('/data/department', data)).data;
    }

    async searchDepartment (data) {
        return (await this.api.patch('/data/department', data)).data;
    }
    async getPositionList () {
        return (await this.api.get('/data/position')).data;
    }

    async addPosition (data) {
        return (await this.api.post('/data/position', data)).data;
    }

    async updatePosition (data) {
        return (await this.api.put('/data/position', data)).data;
    }

    async searchPosition (data) {
        return (await this.api.patch('/data/position', data)).data;
    }

    // Cac dich thao tac voi bang cham cong va bang luong
    // Du lieu cham cong
    async admin_showTimesheet (data) {
        return (await this.api.patch('/admin/timesheet', data)).data;
    }

    async admin_createTimesheet () {
        return (await this.api.post('/admin/timesheet')).data;
    }

    async admin_timekeeping (data) {
        return (await this.api.put('/admin/timesheet', data)).data;
    }

    // Du lieu bang luong
    async admin_showPaysheet (data) {
        return (await this.api.get('/admin/paysheet', data)).data;
    }

    async admin_createPaysheet () {
        return (await this.api.post('/admin/paysheet')).data;
    }

    async admin_upadatePaysheet (data) {
        return (await this.api.put('/admin/paysheet', data)).data;
    }

    async getPaysheetList () {
        return (await this.api.get('/data/paysheetlist')).data;
    }
}

export default new Service();