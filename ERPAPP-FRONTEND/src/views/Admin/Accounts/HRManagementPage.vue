<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/Account/AccLayout/header.vue';
    import Panigation from '@/components/Account/AccLayout/UserListPanigation.vue';

    export default {
        data () {
            const thead = ['MSNV', 'Họ Tên', 'Chi Nhánh', 'Bộ Phận', 'Chức Vụ'];

            return {
                user: {},
                thead,
                userlist: [],
                listshow: [],
                listlength: 0,
                curpage: 1,
                limit: 15,
                page: 1,
                key: '',
            }
        },

        components: {
            AppHeader,
            Navigation,
            Panigation,
            Form,
            Field,
        },

        methods: {
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            showPage (page_num) {
                this.curpage = page_num;
                this.listshow.splice(0, this.listshow.length);
                const first = this.limit * (this.curpage - 1);
                const last = (((this.limit * this.curpage) - 1) < this.listlength - 1) ? (this.limit * this.curpage) - 1 : (this.listlength -1);
                for(var i = first; i <= last; i++){
                    this.listshow.push(this.userlist[i]);
                }
            },

            addAndShowList (list) {
                this.userlist = list;
                this.listlength = list.length;
                this.page = ((this.listlength % this.limit) === 0) ? (this.listlength / this.limit) : (((this.listlength - (this.listlength % this.limit)) / this.limit) + 1);
                this.showPage(1);
            },

            async getUserList () {
                try {
                    const users = await Services.showStaff();
                    if (users.length === 0) throw err;
                    this.addAndShowList(users);
                } catch (err) {
                    console.log(err);
                }
            },

            async searchUser (data) {
                console.log(data);
            },

            async showUser (msnv) {
                console.log(msnv);
            },

            async addForm () {
                console.log('add');
            },

            async editForm (msnv) {
                console.log(msnv);
            },

            async enableUser (msnv) {
                console.log(msnv);
            },

            async disableUser (msnv) {
                console.log(msnv);
            },

            async resetPass (msnv) {
                console.log(msnv);
            },
        },

        async created() {
            this.checkLogin();
            await this.getUserList();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <Navigation />
        <div id="search_bar">
            <Form class="d-flex" role="search" @submit="searchUser">
                <Field name="key" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button class="btn btn-outline-success" type="submit">Search</button>
            </Form>
        </div>
        <div id="user">
            <h2>Danh Sách Nhân Viên</h2>
            <div id="user_list">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" v-for="item in thead">{{ item }}</th>
                            <th scope="col" class="list_action">
                                <button @click="addForm"><font-awesome-icon :icon="['fas', 'plus']" /></button>
                                <button @click="getUserList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in listshow" :key="row.msnv">
                            <th scope="row"><img :src="row.avt_secure_url" style="height: 50px; width: 50px;"></th>
                            <td>{{ row.msnv }}</td>
                            <td>{{ row.hoten }}</td>
                            <td>{{ row.tenchinhanh }}</td>
                            <td>{{ row.tenbophan }}</td>
                            <td>{{ row.tenchucvu }}</td>
                            <td class="list_action">
                                <button @click="showUser(row.msnv)"><font-awesome-icon :icon="['fas', 'eye']" /></button>
                                <button @click="editForm(row.msnv)"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                                <button @click="disableUser(row.msnv)" :style="{display : (row.trangthai_taikhoan !== 1) ? 'none' : ''}"><font-awesome-icon :icon="['fas', 'lock']" /></button>
                                <button @click="enableUser(row.msnv)" :style="{display : (row.trangthai_taikhoan !== 0) ? 'none' : ''}"><font-awesome-icon :icon="['fas', 'lock-open']" /></button>
                                <button @click="resetPass(row.msnv)"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                            </td>
                        </tr>
                    </tbody>
                    <Panigation :page="page" :current-page="curpage" @change="showPage" />
                </table>
            </div>
        </div>
        <div id="show_user"></div>
        <div id="edit_user"></div>
        <div id="add_user"></div>
    </main>
</template>