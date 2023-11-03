<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Services from '@/services/admin.services';
    import GenderChart from '@/components/Admin/Dashboard/GenderChart.vue';
    import OvertimeChart from '@/components/Admin/Dashboard/OvertimeChart.vue';
    import DepartmentTotalSalary from '@/components/Admin/Dashboard/DepartmentTotalSalary.vue';
    
    export default {
        components: {
            AppHeader,
            GenderChart,
            OvertimeChart,
            DepartmentTotalSalary,
        },

        data () {
            return {
                month: 0,
                year: 0,
                name: '',
                tangcatrungbinh: {},
                phanbotheotuan: {},
                tongnhanvien: {},
                gioitinh: [],
                luong: {},
                luongtheobophan: [],
            }
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

            // Lay du lieu tong quan
            async getOverview () {
                try {
                    const overview = await Services.overview();
                    this.tongnhanvien = overview.tongnhanvien;
                    this.gioitinh = overview.gioitinh;
                    this.luong = overview.luong;
                    this.luongtheobophan = overview.luongtheobophan;
                } catch (err) {
                    console.log(err);

                }
            },

            // Lay du lieu tang ca
            async getOverTime () {
                try {
                    const data = {thang: this.month, nam: this.year};
                    const overtime = await Services.overtime(data);
                    this.tangcatrungbinh = overtime.tangcatrungbinh;
                    this.phanbotheotuan = overtime.phanbotheotuan;
                } catch (err) {
                    console.log(err);
                }
            },

            // Xay dung trang 
            setUpPage () {
                this.name = $cookie.get('hoten');
                const today = new Date();
                this.month = (today.getMonth() === 0) ? 12 : today.getMonth();
                this.year = (today.getMonth() === 0) ? today.getFullYear() - 1: today.getFullYear();
            },
        },

        async created () {
            this.checkLogin();
            this.checkAccessPermission();
            this.setUpPage();
            await this.getOverview();
            await this.getOverTime();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h3>Xin chào {{ name }}</h3>
        <h1>Báo cáo tổng quan</h1>
        <div id="figures">
            <div id="all_user" class="small_card">
                <span class="icon" :style="{border: '1px solid var(--color-brown-bg)'}"><font-awesome-icon :icon="['fas', 'users']" :style="{color: 'var(--color-brown-bg)'}" /></span>
                <p>Tổng số nhân viên:</p>
                <h4>{{ tongnhanvien.soluongnhanvien }} người.</h4>
            </div>
            <div id="avg_overtime" class="small_card">
                <span class="icon" :style="{border: '1px solid red'}"><font-awesome-icon :icon="['fas', 'user-clock']" :style="{color: 'red'}" /></span>
                <p>Thời gian tăng ca trung bình:</p>
                <h4>
                    {{ Intl.NumberFormat('vi-VN').format(tangcatrungbinh.sogiotangcatrungbinh) }} giờ/người.
                    <span :style="{color: (tangcatrungbinh.xuhuong <= 0) ? 'green' : 'red', border: (tangcatrungbinh.xuhuong <= 0) ? '1px solid green' : '1px solid red'}">{{ Intl.NumberFormat('vi-VN').format(tangcatrungbinh.xuhuong) }}%</span>
                </h4>
            </div>
            <div id="total_salary" class="small_card">
                <span class="icon" :style="{border: '1px solid green'}"><font-awesome-icon :icon="['fas', 'sack-dollar']" :style="{color: 'green'}" /></span>
                <p>Tổng lương đợt {{ luong.id_dotluong }}: </p>
                <h4>{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(luong.tongluong) }}. </h4>
            </div>
        </div>
        <div id="chart">
            <GenderChart v-if="gioitinh.length !== 0" :gender="gioitinh" class="big_card" :style="{width: '30%'}" />
            <OvertimeChart v-if="Object.values(phanbotheotuan).length !== 0" :overtime="phanbotheotuan" class="big_card" :style="{width: '65%'}" />
            <DepartmentTotalSalary v-if="luongtheobophan.length !== 0" :department="luongtheobophan" class="big_card" :style="{width: '97%'}" />
        </div>
    </main>
</template>

<style>
    @import url('@/assets/Admin/Dashboard/dashboard.css');
</style>