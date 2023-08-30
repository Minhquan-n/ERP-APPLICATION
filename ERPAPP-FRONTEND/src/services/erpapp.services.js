import CreateApiService from './api_service'

class Service {
    constructor (baseUrl = '/api/erpapp') {
        this.api = CreateApiService(baseUrl);
    }

    // Cac dich vu cua admin
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

    // Cac dich vu chung dung cho tat ca nhan vien 
    async login (data) {
        return (await this.api.post('/login', data)).data;
    }

    async logout () {
        return (await this.api.post('/logout')).data;
    }

    async showUserInfo () {
        return (await this.api.get('/profile')).data;
    }

    async changePass (data) {
        return (await this.api.post('/profile', data)).data;
    }

    async updateUserInfo (data) {
        return (await this.api.put('/profile', data)).data;
    }
}

export default new Service();