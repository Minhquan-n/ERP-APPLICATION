<script>
    import $cookie from 'vue-cookies';
    import AppHeader from '@/components/Layout/AppHeader.vue';

    export default {
        data () {
            return {
                
            }
        },

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
        <h1>Data Catalogue Page</h1>
    </main>
</template>