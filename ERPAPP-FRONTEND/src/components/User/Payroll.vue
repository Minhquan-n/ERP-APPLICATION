<script>
    import UserServices from '@/services/user.services';
    import AdminServices from '@/services/admin.services';

    export default {
        data () {
            return {
                payrollsid: [],
                payrollid: '',
                payroll: {},
            };
        },

        methods: {
            // Lay danh sach cac dot luong
            async getPayRollId () {
                try {
                    this.payrollsid = await AdminServices.getPaysheetList();
                    if (this.payrollsid.length === 0) throw err;
                    this.payrollid = this.payrollsid[0].id_dotluong;
                } catch (err) {
                    console.log(err);
                }
            },

            // Lay bang luong cua nhan vien
            async getPayroll () {
                try {
                    this.payroll = await UserServices.getPaysheet({dotluong: this.payrollid});
                } catch (err) {
                    console.log(err);
                }
            },

            async setUpPage () {
                await this.getPayRollId();
                await this.getPayroll();
            }
        },

        created () {
            this.setUpPage();
        }
    }
</script>

<template>
    <div id="payroll">
        <h1>Bảng lương nhân viên {{ payroll.hoten }}</h1>
        <div id="heading">
            <div class="form_select_field">
                <label class="form-label" for="form_payroll_id">Đợt lương</label>
                <select class="form-select w-25" name="payroll_id" id="form_payroll_id" v-model="payrollid" @change="getPayroll">
                    <option v-for="item in payrollsid" :value="item.id_dotluong">{{ item.id_dotluong }}</option>
                </select>
            </div>
        </div>
        <div>
            <p class="w-100 d-flex justify-content-end">
                Trạng thái: {{ (payroll.trangthai === 1) ? 'Đã khóa bảng lương.' : 'Chưa khóa bảng lương.' }}
            </p>
            <table class="table table-hover table-bordered">
                <thead>
                    <tr class="table-primary">
                        <th>Số giờ làm thực tế</th>
                        <th>Số giờ tăng ca</th>
                        <th>Lương cơ bản</th>
                        <th>Tăng ca</th>
                        <th>BHXH</th>
                        <th>BHYT</th>
                        <th>BHTN</th>
                        <th>Thưởng</th>
                        <th>Thực lãnh</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td>{{ payroll.sogiolam }} giờ</td>
                        <td>{{ payroll.sogiotangca }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.luongcoban) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.luongtangca) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.BHXH) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.BHYT) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.BHTN) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.thuong) }}</td>
                        <td>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(payroll.thuclanh) }}</td>
                        <td>{{ payroll.ghichu }}</td>                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
    #payroll {
        width: 95%;
        margin: 20px 0;
    }
</style>