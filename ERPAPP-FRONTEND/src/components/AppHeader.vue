<script>
    import Services from '@/services/erpapp.services';
    import $cookie from 'vue-cookies';

    export default {

        methods: {
            checkIsAuth () {
                if($cookie.get('loggedin') === 'false') this.$router.push({name: 'LoginPage'});
            },

            async logout () {
                try {
                    if (confirm('Bạn sẽ đăng xuất khỏi ứng dụng.')) {
                        const logout = await Services.logout();
                        if (logout === 'Logout success')
                            this.$router.push({name: 'LoginPage'});
                        else throw new Error('Đăng xuất thất bại.');
                    }
                } catch (error) {
                    console.log(error);
                    alert('Đăng xuất thất bại.');
                }
            }
        },

        created () {
            this.checkIsAuth();
        }
    }
</script>

<template>
    <header>
        <b @click="logout">Logout</b>
    </header>
</template>