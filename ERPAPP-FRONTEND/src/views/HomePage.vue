<script>
    import $cookie from 'vue-cookies'

    export default {
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
    <h1>Home Page</h1>
</template>