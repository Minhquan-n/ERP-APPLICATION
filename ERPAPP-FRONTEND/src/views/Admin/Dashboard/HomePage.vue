<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Services from '@/services/admin.services';

    export default {
        components: {
            AppHeader,
        },

        data () {
            return {
                overview: {},
                overtime: {},
                month: 0,
                year: 0,
                name: '',
            }
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            async getOverview () {
                try {
                    this.overview = await Services.overview();
                } catch (err) {
                    console.log(err);
                }
            },

            async getOverTime () {
                try {
                    const data = {thang: this.month, nam: this.year};
                    this.overtime = await Services.overtime(data);
                } catch (err) {
                    console.log(err);
                }
            },

            async setUpPage () {
                this.name = $cookie.get('hoten');
                const today = new Date();
                this.month = today.getMonth() + 1;
                this.year = today.getFullYear();
                await this.getOverview();
                await this.getOverTime();
            }
        },

        created() {
            this.checkLogin();
            this.setUpPage();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h2>Xin chào {{ name }}</h2>
        <div id="overview">
            {{ overview }}
        </div>
        <div id="overtime">
            <div id="average_overtime">
                {{ overtime }}
            </div>
            <div id="overtime_on_week">
                
            </div>
        </div>
    </main>
</template>

<style>
@import '@/assets/base.css';
</style>