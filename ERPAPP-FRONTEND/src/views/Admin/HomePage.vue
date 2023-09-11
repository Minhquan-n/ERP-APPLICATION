<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/Layout/AppHeader.vue';

    export default {
        components: {
            AppHeader,
        },

        methods: {
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },
        },

        created() {
            this.checkLogin();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <h1>Home Page</h1>
    </main>
</template>

<style>
@import '@/assets/base.css';
</style>