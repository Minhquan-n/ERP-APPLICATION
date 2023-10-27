<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/Account/header.vue';
    import Panigation from '@/components/Account/UserListPanigation.vue';
    import ShowUser from '@/components/Account/ShowUser.vue';
    import AddForm from '@/components/Account/AddUserForm.vue';
    import EditForm from '@/components/Account/EditUserForm.vue';

    export default {
        data () {
            const thead = ['MSNV', 'Họ tên', 'Chi nhánh', 'Bộ phận', 'Chức vụ'];

            const user = {
                taikhoan: {},
                ttcn: {},
                ttcv: {},
                hdld: {},
                chinhanh: {},
                bophan: {},
                chucvu: {},
                avt: {
                    avt_secure_url: '',
                }
            };

            const list = {
                user: user,
                userlist: [],
                listlength: 0,
            };

            return {
                thead,
                list,
                listshow: [],
                curpage: 1,
                limit: 15,
                page: 1,
                key: '',
                showuser: false,
                addform: false,
                editform: false,
                serverMessage: '',
            }
        },

        components: {
            AppHeader,
            Navigation,
            Panigation,
            ShowUser,
            AddForm,
            EditForm,
            Form,
            Field,
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            // Cac ham hien thi danh sach nhan vien
            showPage (page_num) {
                this.curpage = page_num;
                this.listshow.splice(0, this.listshow.length);
                const first = this.limit * (this.curpage - 1);
                const last = (((this.limit * this.curpage) - 1) < this.list.listlength - 1) ? (this.limit * this.curpage) - 1 : (this.list.listlength -1);
                for(var i = first; i <= last; i++){
                    this.listshow.push(this.list.userlist[i]);
                }
            },

            addAndShowList (list) {
                this.list.userlist = list;
                this.list.listlength = list.length;
                this.page = ((this.list.listlength % this.limit) === 0) ? (this.list.listlength / this.limit) : (((this.list.listlength - (this.list.listlength % this.limit)) / this.limit) + 1);
                this.showPage(1);
            },

            async getUserList () {
                try {
                    const users = await Services.showStaff();
                    if (users.length === 0) throw new err;
                    this.addAndShowList(users);
                } catch (err) {
                    console.log(err);
                }
            },

            // Ham tim kiem nhan vien
            async searchUser (data) {
                try {
                    const search = await Services.searchUser(data);
                    this.addAndShowList(search);
                } catch (err) {
                    console.log(err);
                }
            },

            // Cac ham hien thi du lieu nhan vien
            async getUserInfo (msnv) {
                try {
                    const user = await Services.showUserInfo(msnv);
                    if (Object.keys.length === 0) throw err;
                    this.list.user = user;
                } catch (err) {
                    console.log(err);
                }
            },

            async showUser (msnv) {
                if (this.showuser) {
                    this.showuser = false;
                } else {
                    await this.getUserInfo(msnv);
                    this.showuser = true;
                }
            },

            // Cac ham them nhan vien
            async addForm () {
                this.addform = (this.addform) ? false : true;
            },

            async addUser (message) {
                this.getUserList();
                this.serverMessage = message;
                this.resetMessage();
            },

            // Cac ham sua thong tin cong viec nhan vien
            async editForm (msnv) {
                await this.getUserInfo(msnv);
                this.editform = (this.editform) ? false : true;
            },

            async editUser (message) {
                this.serverMessage = message;
                this.editform = false;
            },

            // Cac ham cap nhat trang thai tai khaon
            updateDisable (msnv) {
                (this.list.userlist).find((item, index) => {
                    if (item.msnv === msnv) {
                        this.list.userlist[index].trangthai_taikhoan = 0;
                    }
                });
            },

            updateEnable (msnv) {
                (this.list.userlist).find((item, index) => {
                    if (item.msnv === msnv) {
                        this.list.userlist[index].trangthai_taikhoan = 1;
                    }
                });
            },

            resetMessage () {
                setTimeout(() => {
                    this.serverMessage = '';
                }, 2000);
            },

            // Ham kich hoat tai khoan nhan vien
            async enableUser (msnv) {
                try {
                    const enable = await Services.enableUser(msnv);
                    if (enable !== 'Success') throw err;
                    this.serverMessage = `Đã kích hoạt lại người dùng ${msnv}`;
                    this.updateEnable(msnv);
                    this.resetMessage();
                } catch (err) {
                    this.serverMessage = `Kích hoạt thất bại.`;
                    this.resetMessage();
                    console.log(err);
                }
            },

            // Ham vo hieu hoa nhan vien
            async disableUser (msnv) {
                try {
                    const disable = await Services.disableUser(msnv);
                    if (disable !== 'Success') throw err;
                    this.serverMessage = `Đã vô hiệu hóa người dùng ${msnv}`;
                    this.updateDisable(msnv);
                    setTimeout(() => {
                        this.serverMessage = '';
                    }, 2000);
                } catch (err) {
                    this.serverMessage = 'Vô hiệu tài khoản thất bại.';
                    this.resetMessage();
                    console.log(err);
                }
            },

            // Ham dat lai mat khau cho nhan vien
            async resetPass (msnv) {
                try {
                    const reset = await Services.resetPass(msnv);
                    if (reset !== 'Success') throw err;
                    this.serverMessage = `Đặt lại mật khẩu cho tài khoản ${msnv} thành công.`;
                    this.resetMessage();
                } catch (err) {
                    this.serverMessage = 'Đặt lại mật khẩu thất bại.';
                    this.resetMessage();
                    console.log(err);
                }
                
            },
        },

        async created () {
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
            <h2>Danh sách nhân viên</h2>
            <p>{{ this.serverMessage }}</p>
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
                            <th scope="row"><img :src="row.avt_secure_url" style="height: 35px; width: 35px;"></th>
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
        <div id="show_user" :style="{display: (showuser) ? 'block' : 'none'}">
            <ShowUser :user="list.user" />
        </div>
        <div id="edit_user" :style="{display: (editform) ? 'block' : 'none'}">
            <h2>Chỉnh sửa thông tin công việc</h2>
            <EditForm :user="list.user" @edituser="editUser" />
        </div>
        <div id="add_user" :style="{display: (addform) ? 'block' : 'none'}">
            <h2>Tạo nhân viên mới</h2>
            <AddForm @adduser="addUser" />
        </div>
    </main>
</template>