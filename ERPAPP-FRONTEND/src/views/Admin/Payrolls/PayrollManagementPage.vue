<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Panigation from '@/components/Admin/Account/UserListPanigation.vue';
    import PayrollDetail from '@/components/Admin/Payrolls/UpdateUserPayroll.vue'

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
                inform: false,
                success: false,
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

            // Kiem tra quyen truy cap
            checkAccessPermission () {
                const position = $cookie.get('position');
                const permission = [1, 4];
                const checkPermission = permission.findIndex((val) => val === Number(position));
                if (checkPermission === -1) this.$router.push({name: 'UserProfilePage'});
            },

            // Ham khoi thong bao tu server
            resetMessage () {
                setTimeout(() => {
                    this.inform = false;
                    this.serverMessage = '';
                }, 5000);
            },

            // Lay danh sach cac dot luong
            async getPayRollId () {
                try {
                    this.payrollsid = await Services.getPaysheetList();
                    if (this.payrollsid.length === 0) throw err;
                    this.payrollid = this.payrollsid[0].id_dotluong;
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
                    console.log(this.payrolls)
                } catch (err) {
                    console.log(err);
                    this.serverMessage = `Không có dữ liệu về bảng lương đợt ${this.payrollid}`;
                    this.success = false;
                    this.inform = true;
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
            async editPayroll (status) {
                await this.getPayrolls();
                this.serverMessage = (status) ? `Cập nhật bảng lương ${this.userpayroll.hoten} thành công` : `Cập nhật bảng lương ${this.userpayroll.hoten} thất bại`;
                this.success = (status) ? true : false;
                this.inform = true;
                this.resetMessage();
            },

            // Ham tao bang luong mơi
            async createPayroll () {
                try {
                    const create = await Services.admin_createPaysheet();
                    if (create !== 'Success') throw err;
                    this.setUpPage();
                    this.serverMessage = 'Tạo đợt lương mới thành công.';
                    this.success = true;
                    this.inform = true;
                    this.resetMessage();
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Tạo đợt lương mới thất bại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            },

            // Ham khoa bang luong
            async blockPaysheets () {
                try {
                    if (confirm(`Xác nhận khóa bảng lương đợt lương ${this.payrollid}`)) {
                        const data = {dotluong: this.payrollid};
                        const block = await Services.blockPaysheet(data);
                        if (block !== 'Success') throw err;
                        this.setUpPage();
                        this.serverMessage = `Đã khóa bảng lương đợt lương ${this.payrollid}.`;
                        this.success = true;
                        this.inform = true;
                        this.resetMessage();
                    }
                } catch (err) {
                    console.log(err);
                    this.serverMessage = 'Khóa bảng lương thất bại.'
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            }
        },

        async created () {
            this.checkLogin();
            this.checkAccessPermission();
            this.setUpPage();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h1>Bảng Lương Nhân Viên</h1>
        <div id="heading">
            <div id="select_side">
                <div class="form_row">
                    <div class="form_field small_field">
                        <label class="form-label" for="form_payroll_id">Đợt lương</label>
                        <select class="form-select" name="payroll_id" id="form_payroll_id" v-model="payrollid">
                            <option v-for="item in payrollsid" :value="item.id_dotluong">{{ item.id_dotluong }}</option>
                        </select>
                    </div>
                    <div class="form_field small_field">
                        <label class="form-label" for="form_payroll_branch">Chi nhánh</label>
                        <select class="form-select" name="payroll_branch" id="form_payroll_branch" v-model="branch">
                            <option value="0">Tất cả</option>
                            <option v-for="item in payrollsbranch" :value="item.id_chinhanh">{{ item.tenchinhanh }}</option>
                        </select>
                    </div>
                </div>
                <div class="form_field large_row">
                    <button class="form_btn btn btn-primary" @click="getPayrolls">Liệt kê</button>
                </div>
            </div>
            <div id="mode_button">
                <button type="button" class="btn btn-outline-primary" @click="createPayroll"><font-awesome-icon :icon="['fas', 'plus']" /> Tạo bảng lương</button>
                <button type="button" class="btn btn-primary" @click="blockPaysheets">Khóa bảng lương</button>
            </div>
        </div>
        <div id="paysheet">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" v-for="item in thead">{{ item }}</th>
                        <th scope="col" class="list_action">
                            <button class="act_btn btn btn-outline-info" @click="getPayrolls"><font-awesome-icon :icon="['fas', 'rotate']" /></button>
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
                            <button class="act_btn btn btn-outline-secondary" @click="payrollDetail(row.id_bangluong)" :disabled="(row.trangthai === 1)" data-bs-toggle="modal" data-bs-target="#payroll_detail">
                                <font-awesome-icon :icon="['fas', 'pen']" />
                            </button>
                        </td>
                    </tr>
                    <tr v-else :style="{width: '100%'}"><p>Không có dữ liệu.</p></tr>
                </tbody>
            </table>
            <Panigation :page="page" :current-page="curpage" @change="showPage" />
        </div>
        <div id="payroll_detail" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thông tin bảng lương nhân viên {{ userpayroll.hoten }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <PayrollDetail :user-payroll="userpayroll" @update-payroll="editPayroll" />
                </div>
            </div>
        </div>
        <div class="inform alert" :class="[(success) ? 'alert-success' : 'alert-danger']" :style="{display: (inform) ? 'flex' : 'none'}">
            <div>{{ serverMessage }}</div>
        </div>
    </main>
</template>

<style>
    @import url('@/assets/Admin/TimesheetPayroll/timesheet.css');
</style>