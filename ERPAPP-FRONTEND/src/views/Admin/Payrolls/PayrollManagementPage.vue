<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Panigation from '@/components/Account/UserListPanigation.vue';
    import PayrollDetail from '@/components/Payrolls/UpdateUserPayroll.vue'

    export default {
        data () {
            const thead = ['MSNV', 'Họ tên', 'Vị trí', 'Lương cơ bản', 'Thực lãnh', 'Đợt lương'];

            return {
                thead,
                payrollsid: [],
                payrollid: '',
                payrollsbranch: [],
                branch: 0,
                payrolls: [],
                payrollshow: [],
                payrolllength: 0,

                limit: 10,
                page: 1,
                curpage: 1,

                payrolldetail: false,
                userpayroll: {},

                serverMessage: '',
            }
        },

        components: {
            AppHeader,
            Panigation,
            PayrollDetail,
            Form,
            Field,
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            // Ham reset server message
            resetMessage () {
                setTimeout(() => {
                    this.serverMessage = '';
                }, 2000);
            },

            // Lay danh sach cac dot luong
            async getPayRollId () {
                try {
                    this.payrollsid = await Services.getPaysheetList();
                    if (this.payrollsid.length === 0) throw err;
                    this.payrollid = this.payrollsid[this.payrollsid.length - 1].id_dotluong;
                } catch (err) {
                    console.log(err);
                }
            },

            async getBranchList () {
                try {
                    this.payrollsbranch = await Services.getBranchList();
                    if (this.payrollsbranch.length === 0) throw err;
                } catch (err) {
                    console.log(err);
                }
            },

            // Cac ham hien thi danh sach nhan vien
            showPage (page_num) {
                this.curpage = page_num;
                this.payrollshow.splice(0, this.payrollshow.length);
                const first = this.limit * (this.curpage - 1);
                const last = (((this.limit * this.curpage) - 1) < this.payrolllength - 1) ? (this.limit * this.curpage) - 1 : (this.payrolllength -1);
                for(var i = first; i <= last; i++){
                    this.payrollshow.push(this.payrolls[i]);
                }
            },

            // Ham lay danh sach bang luong cua nhan vien theo dot luong
            async getPayrolls () {
                try {
                    const data = {dotluong: this.payrollid, chinhanh: this.branch};
                    this.payrolls = await Services.admin_showPaysheet(data);
                    if (this.payrolls.length === 0) throw err;
                    this.payrolllength = this.payrolls.length;
                    this.page = ((this.payrolllength % this.limit) === 0) ? (this.payrolllength / this.limit) : (((this.payrolllength - (this.payrolllength % this.limit)) / this.limit) + 1);
                    this.showPage(1);
                } catch (err) {
                    console.log(err);
                    this.serverMessage = `Không có dữ liệu về bảng lương đợt ${this.payrollid}`;
                    this.resetMessage();
                }
            },

            // Khoi tao page voi bang cham cong thang hien tai
            async setUpPage () {
                await this.getPayRollId();
                await this.getBranchList();
                await this.getPayrolls();
            },
            
            // Ham mo chi tiet bang luong
            payrollDetail (id_bangluong) {
                const index = this.payrolls.findIndex((item) => {
                    return item.id_bangluong === id_bangluong;
                });
                this.userpayroll = this.payrolls[index];
                console.log(this.userpayroll);
                this.payrolldetail = (this.payrolldetail) ? false : true;
            },

            // Ham nhan trang thai chinh sua bang luong
            async editPayroll (message) {
                await this.getPayrolls();
                this.payrolldetail = false;
                this.serverMessage = message;
                this.resetMessage();
            },

            // Ham tao bang luong mơi
            async createPayroll () {
                try {
                    const create = await Services.admin_createPaysheet();
                    if (create !== 'Success') throw err;
                    this.setUpPage();
                    this.serverMessage = 'Tạo đợt lương mới thành công.';
                    this.resetMessage();
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Tạo đợt lương mới thất bại.';
                    this.resetMessage();
                }
            }
        },

        async created () {
            this.checkLogin();
            this.setUpPage();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h2>Bảng Lương</h2>
        <div id="heading">
            <div class="form_select_field">
                <label for="form_payroll_id">Đợt lương</label>
                <select name="payroll_id" id="form_payroll_id" v-model="payrollid">
                    <option v-for="item in payrollsid.reverse()" :value="item.id_dotluong">{{ item.id_dotluong }}</option>
                </select>
            </div>
            <div class="form_select_field">
                <label for="form_payroll_branch">Chi nhánh</label>
                <select name="payroll_branch" id="form_payroll_branch" v-model="branch">
                    <option value="0">Tất cả</option>
                    <option v-for="item in payrollsbranch" :value="item.id_chinhanh">{{ item.tenchinhanh }}</option>
                </select>
            </div>
            <button @click="getPayrolls">Liệt kê</button>
        </div>
        <div>
            <button @click="createPayroll">Tạo bảng lương</button>
        </div>
        <p>{{ serverMessage }}</p>
        <div id="paysheet">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in thead">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button @click="getPayrolls"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="payrollshow.length !== 0" v-for="(row, index) in payrollshow" :key="row.id_bangluong">
                        <td>{{ row.msnv }}</td>
                        <td>{{ row.hoten }}</td>
                        <td>{{ row.tenchucvu + ' ' + row.tenbophan }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(row.luongcoban) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(row.thuclanh) }}</td>
                        <td>{{ row.id_dotluong }}</td>
                        <td class="list_action">
                            <button @click="payrollDetail(row.id_bangluong)"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                        </td>
                    </tr>
                    <tr v-else :style="{width: '100%'}"><p>Không có dữ liệu.</p></tr>
                </tbody>
                <Panigation :page="page" :current-page="curpage" @change="showPage" />
            </table>
        </div>
        <div id="payroll_detail" :style="{display: (payrolldetail) ? 'block' : 'none'}" >
            <PayrollDetail :user-payroll="userpayroll" @update-payroll="editPayroll" />
        </div>
    </main>
</template>

<style>
    
</style>