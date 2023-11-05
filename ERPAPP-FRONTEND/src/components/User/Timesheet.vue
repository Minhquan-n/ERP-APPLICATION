<script>
    import UserServices from '@/services/user.services';
    import $cookie from 'vue-cookies';

    export default {
        components: {

        },

        data () {
            return {
                name: '',
                header: [],
                timesheet: {},
                month: 0,
                year: 0,
                currmonth: 0,
                curryear: 0,
                timesheetmonth: [],
                timesheetyear: [],
                row: 0,
            }
        },

        methods: {
            // Ham tinh ngay trong thang
            dayOfMonth (month, year) {
                if (month === 2) return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28;
                else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month ===12) return 31;
                else return 30;
            },

            setUpTimesheetMonth () {
                const month = (this.year === this.curryear) ? this.currmonth : 12;
                for (var i = month; i >= 1; i--) this.timesheetmonth.push(i);
            },

            setUpTimesheetYear () {
                for (var i = this.curryear; i >= 2023; i--) this.timesheetyear.push(i);
            },

            // Tao title
            setUpTitle () {
                this.header.length = 0;
                const dayAmount = this.dayOfMonth(this.month, this.year);
                for (var i = 1; i <= dayAmount; i++) this.header.push(i + '/' + this.month);
            },

            // Lay bang luong thang hien tai
            async getTimesheet () {
                try {
                    const data = {thang: this.month, nam: this.year};
                    this.timesheet = await UserServices.getTimesheet(data);
                } catch (err) {
                    console.log(err);
                }
            },  

            // Hien thi bang luong
            async showTimesheet () {
                this.setUpTitle();
                await this.getTimesheet();
            },

            async setUpPage () {
                this.name = $cookie.get('hoten');
                const today = new Date();
                this.month = this.currmonth = today.getMonth() + 1;
                this.year = this.curryear = today.getFullYear();
                this.setUpTimesheetMonth();
                this.setUpTimesheetYear();
                await this.showTimesheet();
                this.row = (((this.month - (this.month % 10)) / 10));
            }
        },

        created () {
            this.setUpPage();
            console.log()
        },
    }
</script>

<template>
    <div id="timesheets">
        <h1>Bảng chấm công nhân viên {{ name }}</h1>
        <div id="timesheet">
            <div id="timesheet_select" class="form_row">
                <div class="form_field small_row">
                    <label class="form-label" for="thang">Tháng</label>
                    <select class="form-select" name="thang" id="thang" v-model="month">
                        <option v-for="item in timesheetmonth" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="form_field small_row">
                    <label class="form-label" for="nam">Năm</label>
                    <select class="form-select" name="nam" id="nam" v-model="year" @change="setUpTimesheetMonth">
                        <option v-for="item in timesheetyear" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="form_field large_row">
                    <button class="form_btn btn btn-primary" @click="showTimesheet">Liệt kê</button>
                </div>
            </div>
            <div id="timesheet_table">
                <table class="table table-hover table-bordered w-100 m-0" v-for="n in 3">
                    <thead>
                        <tr>
                            <th class="table-primary" v-for="i in 12" style="width: 50px; padding: 10px 0; text-align: center;">{{ header[((n * 12) + (i - 1)) - 12] }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="i in 12" 
                                style="width: 50px; padding: 10px 0; text-align: center;"
                                :class="[((timesheet[`${header[((n * 12) + (i - 1)) - 12]}`]) === 'v' || (timesheet[`${header[((n * 12) + (i - 1)) - 12]}`]) === 'p') ? 'table-danger' : '']"
                            >
                                {{ timesheet[`${header[((n * 12) + (i - 1)) - 12]}`] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style>
    @import url('@/assets/User/Profile/profileForm.css');

    #timesheets {
        width: 95%;
        margin: 20px 0;
    }

    #timesheet {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    #timesheet_select {
        width: 30%;
    }

    #timesheet_table {
        width: 70%;
    }
</style>