<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    // components
    import AppHeader from '@/components/Layout/AppHeader.vue';

    export default {
        data () {
            const theadfix = ['MSNV', 'Họ tên'];

            return {
                theadfix,
                thead: [],
                timesheetmonth: [],
                timesheetyear: [],
                timesheetbranch: [],
                timesheet: [],
                dayofmonth: 0,
                today: '',
                month: 0,
                currmonth: 0,
                year: 0,
                curryear: 0,
                branch: '0',
                serverMessage: '',
                timekeeping: false,
                inform: false,
                success: false,
            }
        },

        components: {
            AppHeader,
            
            Form,
            Field,
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
                const permission = [1, 2, 3, 4];
                const checkPermission = permission.findIndex((val) => val === Number(position));
                if (checkPermission === -1) this.$router.push({name: 'UserProfilePage'});
            },

            // Ham tinh ngay trong thang
            dayOfMonth (month, year) {
                if (month === 2) return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28;
                else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month ===12) return 31;
                else return 30;
            },

            // Ham lay bang cham cong
            async getTimesheet (data) {
                try {
                    this.timesheet = await Services.admin_showTimesheet(data);
                } catch (err) {
                    console.log(err);
                }
            },

            // Ham tao thanh tieu de bang
            setUpThead () {
                this.thead.length = 0;
                const daycount = (this.month === this.currmonth) ? this.today : this.dayOfMonth(this.month, this.year);
                for (var i = 1; i <= daycount; i++) {
                    this.thead.push(`${i}/${this.month}`);
                }
            },

            setUpTimesheetMonth () {
                const month = (this.year === this.curryear) ? this.currmonth : 12;
                for (var i = month; i >= 1; i--) this.timesheetmonth.push(i);
            },

            setUpTimesheetYear () {
                for (var i = this.curryear; i >= 2023; i--) this.timesheetyear.push(i);
            },

            async getByDate () {
                const data = {
                    thang: this.month,
                    nam: this.year,
                    chinhanh: this.branch,
                };
                await this.getTimesheet(data);
                this.setUpThead();
                if (this.timesheet.length === 0) {
                    this.success = false;
                    this.serverMessage = 'Bảng chấm công chưa được khởi tạo.';
                    this.inform = true;
                }
            },

            // Khoi tao page voi bang cham cong thang hien tai
            async setUpPage () {
                const currday = new Date();
                const date = currday.getDate();
                const month = currday.getMonth() + 1;
                const year = currday.getFullYear();

                this.dayofmonth = this.dayOfMonth(month, year);
                this.month = month;
                this.currmonth = month;
                this.year = year;
                this.curryear = year;
                this.today = date;

                this.setUpTimesheetMonth();
                this.setUpTimesheetYear();
                this.timesheetbranch = await Services.getBranchList();
                await this.getByDate();
            },
            
            // Ham chuyen che do chinh sua
            changeMode () {
                this.timekeeping = (this.timekeeping) ? false : true;
                this.serverMessage = (this.timekeeping) ? 'Hiển thị chế độ chỉnh sửa.' : 'Hiển thị chế độ chỉ đọc';
                this.success = true;
                this.inform = true;
                this.resetMessage();
            },

            // Ham tao bang cham cong moi
            async createTimesheet () {
                try {
                    const create = await Services.admin_createTimesheet();
                    if (create !== 'Success') throw err;
                    else {
                        this.setUpPage();
                        this.serverMessage = 'Tạo bảng chấm công thành công.';
                        this.success = true;
                        this.inform = true;
                        this.resetMessage();
                    }
                } catch (err) {
                    this.serverMessage = 'Tạo bảng chấm công thất bại.';
                    this.success = false;
                    this.inform = true;
                    this.resetMessage();
                }
            },

            // Ham cap nhat bang cham cong
            async timeKeeping () {
                try {
                    const timekeeping = await Services.admin_timekeeping(this.timesheet);
                    if (timekeeping !== 'Success') throw err;
                    this.setUpPage();
                    this.serverMessage = 'Bảng chấm công đã được cập nhật.';
                    this.success = true;
                    this.inform = true;
                    this.resetMessage();
                } catch (err) {
                    this.serverMessage = 'Đã xảy ra lỗi, không thể cập nhật bảng chấm công.';
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
        <h1>Bảng chấm công</h1>
        <div id="heading">
            <div id="select_side">
                <div class="form_row">
                    <div class="form_field small_field">
                        <label class="form-label" for="form_month">Tháng</label>
                        <select class="form-select" name="month" id="form_month" v-model="month">
                            <option v-for="item in timesheetmonth" :value="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="form_field small_field">
                        <label class="form-label" for="form_year">Năm</label>
                        <select class="form-select" name="year" id="form_year" v-model="year" @change="setUpTimesheetMonth">
                            <option v-for="item in timesheetyear" :value="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="form_field small_field">
                        <label class="form-label" for="form_branch">Chi nhánh</label>
                        <select class="form-select" name="branch" id="form_branch" v-model="branch">
                            <option value="0">Tất cả</option>
                            <option v-for="item in timesheetbranch" :value="item.tenchinhanh">{{ item.tenchinhanh }}</option>
                        </select>
                    </div>
                </div>
                <div class="form_field large_row">
                    <button class="form_btn btn btn-primary" @click="getByDate">Liệt kê</button>
                </div>
            </div>
            <div id="mode_button">
                <button type="button" class="btn btn-outline-primary" :disabled="timekeeping" @click="createTimesheet"><font-awesome-icon :icon="['fas', 'plus']" /> Tạo mới</button>
                <button type="button" class="btn" :class="timekeeping ? 'btn-primary' : 'btn-outline-primary'" @click="changeMode" :disabled="month !== currmonth">Chế độ: {{ timekeeping ? 'Chỉnh sửa' : 'Chỉ đọc' }}</button>
                <button type="button" class="btn btn-primary" :disabled="!timekeeping" @click="timeKeeping">Chấm công</button>
            </div>
        </div>
        <div id="timesheet">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="fixed_col" :class="[(item === 'MSNV') ? ' fixed_msnv' : 'fixed_name']" scope="col" v-for="item in theadfix">{{ item }}</th>
                        <th v-for="item in thead">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="timesheet.length !== 0" v-for="(row, index) in timesheet" :key="row.STT">
                        <td class="fixed_col fixed_msnv">{{ row.MSNV }}</td>
                        <td class="fixed_col fixed_name">{{ row.Name }}</td>
                        <td v-for="item in thead">
                            <input 
                                type="text" 
                                v-model="timesheet[index][`${item}`]" 
                                :readonly="(!timekeeping)"
                                :style="{border: (timekeeping) ? '1px solid rgba(128, 128, 128, 0.5)' : 'none'}"
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="inform alert" :class="[(success) ? 'alert-success' : 'alert-danger']" :style="{display: (inform) ? 'flex' : 'none'}">
            <div>{{ serverMessage }}</div>
        </div>
    </main>
</template>

<style>
    @import url('@/assets/Admin/TimesheetPayroll/timesheet.css');
</style>