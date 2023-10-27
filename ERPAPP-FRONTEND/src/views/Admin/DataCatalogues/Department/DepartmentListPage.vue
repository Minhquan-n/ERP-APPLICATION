<script>
    import $cookie from 'vue-cookies';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import Services from '@/services/admin.services'
    //components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import DataListPanigation from '@/components/DataCatalogues/DataListPanigation.vue';
    import DataList from '@/components/DataCatalogues/Department/DepartmentList.vue';

    export default {
        components: {
            AppHeader,
            DataListPanigation,
            DataList,
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
                errorMessage: false,
            }
        },

        methods: {
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
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
                    } else {
                        const newdepartment = {tenbophan: data.tenbophan};
                        const add = await Services.addDepartment(newdepartment);
                        if (add !== 'Success') throw err;
                        this.serverMessage = 'Thêm bộ phận mới thành công.'
                        this.getDepartmentList();
                    }
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
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
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </Form>
                    </div>
                </div>
            </nav>
        </div>
        <div id="data_list">
            <h2>Danh sách bộ phận</h2>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in listtitle">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button><font-awesome-icon :icon="['fas', 'plus']" @click="formAdd" /></button>
                            <button @click="getDepartmentList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                        </th>
                    </tr>
                </thead>
                <DataList :list-data="listshow" @update="formEdit" />
                <DataListPanigation :page="page" :current-page="currpage" @change="showPage" />
            </table>
        </div>
        <div id="department_form" v-show="form.formStatus">
            <h3>{{ form.formTitle }}</h3>
            <p>{{ serverMessage }}</p>
            <Form name="departmentForm" @submit="submitForm" :validation-schema="formSchema">
                <Field name="id" v-model="form.department.id_bophan" :style="{display: 'none'}" />
                <Field name="tenbophan" v-model="form.department.tenbophan" />
                <ErrorMessage name="tenbophan" />
                <button type="submit">Lưu</button>
            </Form>
        </div>
    </main>
</template>