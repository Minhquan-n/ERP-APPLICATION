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
        <h2>Bảng lương</h2>
        <div id="heading">
            <div class="form_select_field">
                <label for="form_payroll_id">Đợt lương</label>
                <select name="payroll_id" id="form_payroll_id" v-model="payrollid" @change="getPayroll">
                    <option v-for="item in payrollsid" :value="item.id_dotluong">{{ item.id_dotluong }}</option>
                </select>
            </div>
        </div>
        <div>
            {{ payroll }}
        </div>
    </div>
</template>