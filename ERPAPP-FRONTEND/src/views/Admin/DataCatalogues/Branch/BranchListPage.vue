<script>
    import $cookie from 'vue-cookies';
    import { Form, Field } from 'vee-validate';
    import Services from '@/services/admin.services'
    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import DataList from '@/components/DataCatalogues/Branch/DataBranchList.vue';
    import DataListPanigation from '@/components/DataCatalogues/DataListPanigation.vue';
    // import BranchForm from '@/components/DataCatalogues/BranchForm.vue';

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

            return {
                branch,
                branchlist: [],
                listshow: [],
                listtitle,
                listlength: 0,
                currentpage: 1,
                limit: 15,
                page: 1,
                key: '',
                serverMessage: '',
            }
        },

        components: {
            AppHeader,
            DataList,
            DataListPanigation,
            Form,
            Field,
        },

        methods: {
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
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

            addBranchForm () {
                this.$router.push({name: 'AdminDataCatalogAddBranchPage'});
            },

            

            updateBranchForm (id) {
                this.$router.push({
                    name: 'AdminDataCatalogEditBranchPage',
                    query: {id: id},
                });
            },
        },

        created () {
            this.checkLogin();
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
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </Form>
                    </div>
                </div>
            </nav>
        </div>
        <div id="data_list">
            <h2>Danh sách chi nhánh</h2>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in listtitle">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button><font-awesome-icon :icon="['fas', 'plus']" @click="addBranchForm" /></button>
                            <button @click="getBranchList"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                        </th>
                    </tr>
                </thead>
                <DataList :list-data="listshow" @update="updateBranchForm" />
                <DataListPanigation :page="page" :current-page="currentpage" @change="showPage" />
            </table>
        </div>
        <div id="branch_form">
            
        </div>
    </main>
</template>

<style>
    
</style>