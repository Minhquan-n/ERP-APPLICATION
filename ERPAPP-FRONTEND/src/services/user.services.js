import CreateApiService from './api_service'

class Service {
    constructor (baseUrl = '/api/erpapp') {
        this.api = CreateApiService(baseUrl);
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