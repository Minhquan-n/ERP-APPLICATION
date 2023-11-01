<script>
    import UserServices from '@/services/user.services';

    export default {
        components: {

        },

        data () {
            return {
                header: [],
                timesheet: {},
                month: 0,
                year: 0,
                currmonth: 0,
                curryear: 0,
                timesheetmonth: [],
                timesheetyear: [],
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
                const today = new Date();
                this.month = this.currmonth = today.getMonth() + 1;
                this.year = this.curryear = today.getFullYear();
                this.setUpTimesheetMonth();
                this.setUpTimesheetYear();
                await this.showTimesheet();
            }
        },

        created () {
            this.setUpPage();
        },
    }
</script>

<template>
    <div id="timesheet">
        <h2>Bảng chấm công</h2>
        <div>
            <div class="form_field">
                <label for="thang">Tháng</label>
                <select name="thang" id="thang" v-model="month">
                    <option v-for="item in timesheetmonth" :value="item">{{ item }}</option>
                </select>
            </div>
            <div class="form_field">
                <label for="nam">Năm</label>
                <select name="nam" id="nam" v-model="year" @change="setUpTimesheetMonth">
                    <option v-for="item in timesheetyear" :value="item">{{ item }}</option>
                </select>
            </div>
            <button @click="showTimesheet">Liệt kê</button>
        </div>
        <div id="timesheet">
            <div class="timesheet_day" v-for="item in header">
                <p class="day">{{ item }}</p>
                <p class="day_status">{{ timesheet[`${item}`] }}</p>
            </div>
        </div>
    </div>
</template>