<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Panigation from '@/components/Admin/Account/UserListPanigation.vue';
    import ShowUser from '@/components/Admin/Account/ShowUser.vue';
    import AddForm from '@/components/Admin/Account/AddUserForm.vue';
    import EditForm from '@/components/Admin/Account/EditUserForm.vue';

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
                limit: 10,
                page: 1,
                key: '',
                showuser: false,
                addstatus: false,
                editstatus: false,
                serverMessage: '',
                success: false,
                inform: false,
            }
        },

        components: {
            AppHeader,
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
                if ($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            // Kiem tra quyen truy cap
            checkAccessPermission () {
                const position = $cookie.get('position');
                const permission = [1, 2, 3, 4];
                const checkPermission = permission.findIndex((val) => val === Number(position));
                if (checkPermission === -1) this.$router.push({name: 'UserProfilePage'});
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
            async addUser (status) {
                this.getUserList();
                this.success = (status) ? true : false;
                this.serverMessage = (status) ? 'Tạo người dùng mới thành công.' : 'Tạo người dùng mới thất bại';
                this.inform = true;
                this.resetMessage();
            },

            // Cac ham sua thong tin cong viec nhan vien
            async editForm (msnv) {
                await this.getUserInfo(msnv);
            },

            async editUser (status) {
                this.getUserList();
                this.success = (status) ? true : false;
                this.serverMessage = (status) ? 'Chỉnh sửa thông tin công việc thành công' : 'Chỉnh sửa thông tin công việc thất bại.';
                this.inform = true;
                this.resetMessage();
            },

            // Ham cap nhat trang thai tai khoan
            updateUserStatus (msnv, status) {
                (this.list.userlist).find((item, index) => {
                    if (item.msnv === msnv) {
                        this.list.userlist[index].trangthai_taikhoan = status;
                    }
                });
            },

            resetMessage () {
                setTimeout(() => {
                    this.inform = false;
                    this.serverMessage = '';
                }, 5000);
            },

            // Ham kich hoat tai khoan nhan vien
            async enableUser (msnv) {
                try {
                    const enable = await Services.enableUser(msnv);
                    if (enable !== 'Success') throw err;
                    this.serverMessage = `Đã kích hoạt lại người dùng ${msnv}`;
                    this.inform = true;
                    this.updateUserStatus(msnv, 1);
                    this.resetMessage();
                } catch (err) {
                    this.serverMessage = `Kích hoạt thất bại.`;
                    this.success = flase;
                    this.inform = true;
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
                    this.success = true;
                    this.inform = true;
                    this.updateUserStatus(msnv, 0);
                    this.resetMessage()
                } catch (err) {
                    this.serverMessage = 'Vô hiệu tài khoản thất bại.';
                    this.success = false;
                    this.inform = true;
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
                    this.success = true;
                    this.inform = true;
                    this.resetMessage();
                } catch (err) {
                    this.serverMessage = 'Đặt lại mật khẩu thất bại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                    console.log(err);
                }
                
            },
        },

        async created () {
            this.checkLogin();
            this.checkAccessPermission();
            await this.getUserList();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h1>Danh sách nhân viên</h1>
        <div id="search_bar">
            <Form class="d-flex" role="search" @submit="searchUser">
                <Field name="key" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button class="btn btn-outline-primary" type="submit" :style="{border: '2px solid'}">Search</button>
            </Form>
        </div>
        <div id="user">
            <div id="user_list">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" v-for="item in thead">{{ item }}</th>
                            <th scope="col">
                                <div class="list_action">
                                    <button class="act_btn btn btn-outline-primary" @click="addForm" data-bs-toggle="modal" data-bs-target="#add_user">
                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                    </button>
                                    <button class="act_btn btn btn-outline-info" @click="getUserList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in listshow" :key="row.msnv">
                            <th scope="row"><img :src="row.avt_secure_url" class="list_avt"></th>
                            <td>{{ row.msnv }}</td>
                            <td>{{ row.hoten }}</td>
                            <td>{{ row.tenchinhanh }}</td>
                            <td>{{ row.tenbophan }}</td>
                            <td>{{ row.tenchucvu }}</td>
                            <td>
                                <div class="list_action">
                                    <button class="act_btn btn btn-outline-success" @click="showUser(row.msnv)" data-bs-toggle="modal" data-bs-target="#show_user">
                                        <font-awesome-icon :icon="['fas', 'eye']" />
                                    </button>
                                    <button class="act_btn btn btn-outline-secondary" @click="editForm(row.msnv)" data-bs-toggle="modal" data-bs-target="#edit_user">
                                        <font-awesome-icon :icon="['fas', 'pen']" />
                                    </button>
                                    <button class="act_btn btn btn-outline-danger" @click="disableUser(row.msnv)" :style="{display : (row.trangthai_taikhoan !== 1) ? 'none' : ''}"><font-awesome-icon :icon="['fas', 'lock']" /></button>
                                    <button class="act_btn btn btn-outline-danger" @click="enableUser(row.msnv)" :style="{display : (row.trangthai_taikhoan !== 0) ? 'none' : ''}"><font-awesome-icon :icon="['fas', 'lock-open']" /></button>
                                    <button class="act_btn btn btn-outline-info" @click="resetPass(row.msnv)"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Panigation :page="page" :current-page="curpage" @change="showPage" />
            </div>
        </div>
        <div id="show_user" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thông tin chi tiết nhân viên</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="showUser(list.user.msnv)"></button>
                    </div>
                    <div class="modal-body">
                        <ShowUser :user="list.user" />
                    </div>
                </div>
            </div>
        </div>
        <div id="edit_user" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Chỉnh sửa thông tin công việc</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <EditForm :user="list.user" @edituser="editUser" />
                </div>
            </div>
        </div>
        <div class="modal fade" id="add_user" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Tạo nhân viên mới</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <AddForm @adduser="addUser" />
                </div>
            </div>
        </div>
        <div class="inform alert" :class="[(success) ? 'alert-success' : 'alert-danger']" :style="{display: (inform) ? 'flex' : 'none'}">
            <div>{{ serverMessage }}</div>
        </div>
    </main>
</template>

<style>
    @import url('@/assets/Admin/Account/accountPage.css');
</style>