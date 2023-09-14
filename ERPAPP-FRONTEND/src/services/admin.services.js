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
}

export default new Service();