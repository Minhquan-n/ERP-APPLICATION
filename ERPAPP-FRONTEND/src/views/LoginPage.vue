<template>
    <div id="login_page" class="row" :style = "{ height: style + 'px' }">
        <Form>

        </Form>
    </div>
</template>

<script>
    import $cookie from 'vue-cookies'
    import Service from '@/services/erpapp.services'
    import * as yup from 'yup'
    import {Form, Field, ErrorMessage} from 'vee-validate'

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        data() {
            const account = {
                msnv: String,
                matkhau: String,
            }

            const accountSchema = yup.object().shape({

            })

            return {
                style: 0,
                sysmessage: '',

            }
        },

        methods: {
            checkIsAuth () {
                if($cookie.get('loggedin') === 'true') this.$router.push({name: 'HomePage'});
            },

            setStyle () {
                const screenheight = window.innerHeight;
                this.style = screenheight;
            },

            async login (data) {
                try {

                } catch (error) {

                }
            }
        },

        created() {
            this.checkIsAuth();
            this.setStyle();
        },
    }
</script>

<style>
    #login_page {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>