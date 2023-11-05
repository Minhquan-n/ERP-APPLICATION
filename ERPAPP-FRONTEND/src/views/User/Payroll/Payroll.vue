<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/User/ProfileHeader.vue';
    import Payroll from '@/components/User/Payroll.vue';
    import Timesheet from '@/components/User/Timesheet.vue';

    export default {
        components: {
            AppHeader,
            Navigation,
            Payroll,
            Timesheet,
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },
        },

        created () {
            this.checkLogin();
        }
    }
</script>

<template>
    <AppHeader />
    <main>
        <Navigation />
        <div class="main_content">
            <Payroll />
            <Timesheet />
        </div>
    </main>
</template>

<style>
    @import url('@/assets/User/Profile/profilePage.css');
</style>