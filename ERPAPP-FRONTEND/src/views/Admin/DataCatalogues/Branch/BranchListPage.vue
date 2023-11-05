<script>
    import $cookie from 'vue-cookies';
    import { Form, Field } from 'vee-validate';
    import Services from '@/services/admin.services'
    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import DataListPanigation from '@/components/Admin/DataCatalogues/DataListPanigation.vue';
    import BranchForm from '@/components/Admin/DataCatalogues/Branch/BranchForm.vue';

    export default {
        data () {
            const listtitle = ['MSCN', 'Tên chi nhánh', 'Địa chỉ'];

            const branch = {
                tenchinhanh: '',
                tinhthanh: '000',
                quanhuyen: '000',
                phuongxa: 0,
                sonha: '',
            }

            const branchedit = {
                branch: {
                    tenchinhanh: '',
                    tinhthanh: '000',
                    quanhuyen: '000',
                    phuongxa: 0,
                    sonha: '',
                },
                id: 0,
            }

            return {
                branch,
                branchedit,
                branchlist: [],
                listshow: [],
                listtitle,
                listlength: 0,
                currentpage: 1,
                limit: 10,
                page: 1,
                key: '',
                serverMessage: '',
                inform: false,
                success: false,
            }
        },

        components: {
            AppHeader,
            DataListPanigation,
            BranchForm,
            Form,
            Field,
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            // Kiem tra quyen truy cap
            checkAccessPermission () {
                const position = $cookie.get('position');
                if (position !== '1') this.$router.push({name: 'UserProfilePage'});
            },

            // Ham khoi thong bao tu server
            resetMessage () {
                setTimeout(() => {
                    this.inform = false;
                    this.serverMessage = '';
                }, 5000);
            },

            addAndShowList (list) {
                this.branchlist = list;
                for(var i = 0; i < list.length; i++) {
                    this.branchlist[i].diachi = list[i].dccn_sonha + ', ' + list[i].tenphuongxa + ', ' + list[i].tenquanhuyen + ', ' + list[i].tentinhthanh + '.';
                    this.branchlist[i].act_icon = 'pen';
                }
                this.listlength = list.length;
                this.page = ((this.listlength % this.limit) === 0) ? (this.listlength / this.limit) : (((this.listlength - (this.listlength % this.limit)) / this.limit) + 1);
                this.showPage(1);
            },

            async getBranchList () {
                try {
                    const list = await Services.getBranchList();
                    this.addAndShowList(list);
                } catch (err) {
                    console.log(err);
                }
            },

            showPage (page_num) {
                this.currentpage = page_num;
                this.listshow.splice(0, this.listshow.length);
                const first = this.limit * (this.currentpage - 1);
                const last = (((this.limit * this.currentpage) - 1) < this.listlength - 1) ? (this.limit * this.currentpage) - 1 : (this.listlength -1);
                for(var i = first; i <= last; i++){
                    this.listshow.push(this.branchlist[i]);
                }
            },

            async searchBranch (data) {
                try {
                    const search = await Services.searchBranch(data);
                    this.addAndShowList(search);
                } catch (err) {
                    console.log(err);
                }
            },

            async addBranch (data) {
                try {
                    const newBranch = await Services.addBranch(data);
                    if (newBranch !== 'Success') throw err;
                    await this.getBranchList();
                    this.serverMessage = 'Thêm chi nhánh mới thành công.';
                    this.success = true;
                    this.inform = true;
                    this.resetMessage();
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Thêm chi nhánh mới thất bại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            },

            updateBranchForm (id) {
                this.branchedit.id = id;
                this.branchedit.branch = this.branchlist[id - 1];
            },

            resetUpdateBranchForm () {
                this.branchedit = {
                    branch: {
                        tenchinhanh: '',
                        tinhthanh: '000',
                        quanhuyen: '000',
                        phuongxa: 0,
                        sonha: '',
                    },
                    id: 0,
                };
            },

            async updateBranch () {
                try {
                    const update = await Services.updateBranch(this.branchedit.id, this.branchedit.branch);
                    if (update !== 'Success') throw err;
                    this.serverMessage = 'Cập nhật chi nhánh thành công.';
                    this.success = true;
                    this.inform = true;
                    this.resetMessage();
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Cập nhật chi nhánh thất bại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            }
        },

        created () {
            this.checkLogin();
            this.checkAccessPermission();
            this.getBranchList();
        },
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
                                <router-link class="nav-link active" aria-current="page" :to="{name: 'AdminDataCatalogBranchPage'}">Chi nhánh</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" aria-current="page" :to="{name: 'AdminDataCataloguesDepartmentPage'}">Bộ phận</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" aria-current="page" :to="{name: 'AdminDataCataloguesPositionPage'}">Chức vụ</router-link>
                            </li>
                        </ul>
                        <Form class="d-flex" role="search" @submit="searchBranch">
                            <Field name="key" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-primary" type="submit">Search</button>
                        </Form>
                    </div>
                </div>
            </nav>
        </div>
        <div id="data_list" class="main_content">
            <h1>Danh sách chi nhánh</h1>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in listtitle">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button class="act_btn btn btn-outline-primary" @click="addBranchForm" data-bs-toggle="modal" data-bs-target="#branch_add_form">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                            <button class="act_btn btn btn-outline-info" @click="getBranchList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in listshow" :key="row.id_chinhanh">
                        <th scope="row">{{ row.id_chinhanh }}</th>
                        <td>{{ row.tenchinhanh }}</td>
                        <td>{{ row.sonha + ', ' + row.tenphuongxa + ', ' + row.tenquanhuyen + ', ' + row.tentinhthanh + '.' }}</td>
                        <td class="list_action">
                            <button class="act_btn btn btn-outline-secondary" @click="updateBranchForm(row.id_chinhanh)" data-bs-toggle="modal" data-bs-target="#branch_edit_form">
                                <font-awesome-icon :icon=row.act_icon />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <DataListPanigation :page="page" :current-page="currentpage" @change="showPage" />
        </div>
        <div id="branch_add_form" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm chi nhánh</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <BranchForm :branch="branch" @Branch="addBranch" />
                    </div>
                </div>
            </div>
        </div>
        <div id="branch_edit_form" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm chi nhánh</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetUpdateBranchForm"></button>
                    </div>
                    <div class="modal-body">
                        <BranchForm 
                            v-if="branchedit.branch.tinhthanh !== '000' && branchedit.branch.quanhuyen !== '000' && branchedit.branch.phuongxa !== 0" 
                            :branch="branchedit.branch" @Branch="updateBranch" 
                        />
                    </div>
                </div>
            </div>
        </div>
        <div>

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