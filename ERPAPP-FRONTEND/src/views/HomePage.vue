<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/AppHeader.vue';

    export default {
        components: {
            AppHeader,
        },

        methods: {
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            }
        },

        created() {
            this.checkLogin();
        },
    }
</script>

<template>
    <AppHeader />
    <h1>Home Page</h1>
</template>