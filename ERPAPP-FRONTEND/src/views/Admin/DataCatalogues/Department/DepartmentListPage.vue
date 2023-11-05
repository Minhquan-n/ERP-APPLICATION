<script>
    import $cookie from 'vue-cookies';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import Services from '@/services/admin.services'
    //components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import DataListPanigation from '@/components/Admin/DataCatalogues/DataListPanigation.vue';

    export default {
        components: {
            AppHeader,
            DataListPanigation,
            Form,
            Field,
            ErrorMessage,
        },

        data () {
            const listtitle = ['MSBP', 'Tên bộ phận'];

            const form = {
                formTitle: '',
                department: {id_bophan: 0, tenbophan: ''},
                updateForm: false,
                formStatus: false
            }

            const formSchema = yup.object().shape({
                    tenbophan: yup.string().required('Bạn chưa nhập tên bộ phận.'),
                });

            return {
                formSchema,
                departmentlist: [],
                listshow: [],
                listtitle,
                listlength: 0,
                currpage: 1,
                limit: 15,
                page: 1,
                key: '',
                form,
                serverMessage: '',
                inform: false,
                success: false,
            }
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            // Ham khoi thong bao tu server
            resetMessage () {
                setTimeout(() => {
                    this.inform = false;
                    this.serverMessage = '';
                }, 5000);
            },

            // Kiem tra quyen truy cap
            checkAccessPermission () {
                const position = $cookie.get('position');
                if (position !== '1') this.$router.push({name: 'UserProfilePage'});
            },

            addAndShowList (list) {
                this.departmentlist = list;
                for(var i = 0; i < list.length; i++) {
                    this.departmentlist[i].act_icon = 'pen';
                }
                this.listlength = list.length;
                this.page = ((this.listlength % this.limit) === 0) ? (this.listlength / this.limit) : (((this.listlength - (this.listlength % this.limit)) / this.limit) + 1);
                this.showPage(1);
            },

            async getDepartmentList () {
                try {
                    const list = await Services.getDepartmentList();
                    this.addAndShowList(list);
                } catch (err) {
                    console.log(err);
                }
            },

            showPage (page_num) {
                this.currpage = page_num;
                this.listshow.splice(0, this.listshow.length);
                const first = this.limit * (this.currpage - 1);
                const last = (((this.limit * this.currpage) - 1) < this.listlength - 1) ? (this.limit * this.currpage) - 1 : (this.listlength -1);
                for(var i = first; i <= last; i++){
                    this.listshow.push(this.departmentlist[i]);
                }
            },

            async searchDepartment (data) {
                try {
                    const search = await Services.searchDepartment(data);
                    this.addAndShowList(search);
                } catch (err) {
                    console.log(err);
                }
            },

            async submitForm (data) {
                try {
                    if (this.form.updateForm) {
                        console.log(data);
                        const update = await Services.updateDepartment(data);
                        if (update !== 'Success') throw err;
                        this.serverMessage = 'Chỉnh sửa thành công.';
                        this.success = true;
                        this.inform = true;
                        this.resetMessage();
                    } else {
                        const newdepartment = {tenbophan: data.tenbophan};
                        const add = await Services.addDepartment(newdepartment);
                        if (add !== 'Success') throw err;
                        this.serverMessage = 'Thêm bộ phận mới thành công.';
                        this.success = true;
                        this.inform = true;
                        this.resetMessage();
                        this.getDepartmentList();
                    }
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            },

            changeFormStatus () {
                this.serverMessage = '';
                if (this.form.formStatus) {
                    this.form.formStatus = false;
                } else {
                    this.form.formStatus = true;
                }
            },

            formAdd () {
                this.form.updateForm = false;
                this.form.department = {id_bophan: 0, tenbophan: ''};
                this.form.formTitle = 'Thêm bộ phận';
                this.changeFormStatus();
            },

            formEdit (id) {
                this.form.department = this.departmentlist[id - 1];
                this.form.formTitle = 'Chỉnh sửa bộ phận';
                this.form.updateForm = true;
                this.changeFormStatus();
            },
        },

        created () {
            this.checkLogin();
            this.checkAccessPermission();
            this.getDepartmentList();
        }
    }
</script>

<template>
    <AppHeader />
    <main>
        <div id="data_navigation">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <router-link class="nav-link" aria-current="page" :to="{name: 'AdminDataCatalogBranchPage'}">Chi nhánh</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link active" aria-current="page" :to="{name: 'AdminDataCataloguesDepartmentPage'}">Bộ phận</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" aria-current="page" :to="{name: 'AdminDataCataloguesPositionPage'}">Chức vụ</router-link>
                            </li>
                        </ul>
                        <Form class="d-flex" role="search" @submit="searchDepartment">
                            <Field name="key" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-primary" type="submit">Search</button>
                        </Form>
                    </div>
                </div>
            </nav>
        </div>
        <div id="data_list" class="main_content">
            <h1>Danh sách bộ phận</h1>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in listtitle">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button class="act_btn btn btn-outline-primary" @click="formAdd" data-bs-toggle="modal" data-bs-target="#department_form">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                            <button class="act_btn btn btn-outline-info" @click="getDepartmentList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in listshow" :key="row.id_bophan">
                        <th scope="row">{{ row.id_bophan }}</th>
                        <td>{{ row.tenbophan }}</td>
                        <td class="list_action">
                            <button class="act_btn btn btn-outline-secondary" @click="formEdit(row.id_bophan)" data-bs-toggle="modal" data-bs-target="#department_form">
                                <font-awesome-icon :icon=row.act_icon />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <DataListPanigation :page="page" :current-page="currpage" @change="showPage" />
        </div>
        <div id="department_form" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ form.formTitle }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <Form name="departmentForm" @submit="submitForm" :validation-schema="formSchema">
                            <div class="form_row">
                                <Field class="form-control" name="id" v-model="form.department.id_bophan" :style="{display: 'none'}" />
                                <div class="form_field large_field">
                                    <label class="form-label" for="tenchucvu">Tên chức vụ</label>
                                    <Field class="form-control" name="tenbophan" id="tenbophan" v-model="form.department.tenbophan" />
                                    <ErrorMessage class="text-danger" name="tenbophan" />
                                </div>
                            </div>
                            <div class="form_button">
                                <button type="button" class="form_btn btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" class="form_btn btn btn-primary" data-bs-dismiss="modal">Cập nhật</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        <div class="inform alert" :class="[(success) ? 'alert-success' : 'alert-danger']" :style="{display: (inform) ? 'flex' : 'none'}">
            <div>{{ serverMessage }}</div>
        </div>
    </main>
</template>

<style>
    @import url('@/assets/User/Profile/profilePage.css');
    @import url('@/assets/Admin/Account/accountForm.css');
</style>