<script>
    import $cookie from 'vue-cookies';
    import Service from '@/services/user.services';
    import * as yup from 'yup';
    import {Form, Field, ErrorMessage} from 'vee-validate';

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
                msnv: yup.string()
                        .required('! Nhập mã số nhân viên của bạn.'),
                matkhau: yup.string()
                        .required('! Nhập mật khẩu đăng nhập của bạn.')
                        .min(8, '! Mật khẩu phải từ 8 ký tự trở lên')
            })

            return {
                style: 0,
                serverMessage: '',
                account,
                accountSchema,
                hasError: false,
                loginFail: 0,
                blockLogin: false,
            }
        },

        methods: {
            checkIsAuth () {
                if($cookie.get('loggedin') === 'true') this.$router.push({name: 'AdminHomePage'});
            },

            setStyle () {
                const screenheight = window.innerHeight;
                this.style = screenheight;
            },

            async login (data) {
                if ($cookie.get('block')) {
                    this.hasError = true;
                    this.serverMessage = 'CẢNH BÁO: Bạn không thể truy cập vào hệ thống từ địa chỉ IP này. Liên hệ với quản trị viên để được hỗ trợ.';
                    this.blockLogin = true;
                } else {
                    try {
                        const login = await Service.login(data);
                        if (login === 'Blocked') {
                            this.hasError = true;
                            this.serverMessage = 'Tài khoản đã bị vô hiệu hóa.';
                        } else if (login !== 'Login success') {
                            throw new Error(login);
                        } else {
                            this.hasError = false;
                            this.serverMessage = 'Đăng nhập thành công.';
                            const access = $cookie.get('position');
                            setTimeout(() => {
                                switch (access){
                                    case '1': this.$router.push({name: 'AdminHomePage'}); break;
                                }
                            }, 500);
                        }
                    } catch (error) {
                        this.serverMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
                    }
                }
            }
        },

        created () {
            this.checkIsAuth();
            this.setStyle();
        },
    }
</script>

<template>
    <div id="login_page" class="row" :style = "{ height: style + 'px' }">
        <Form 
            id="login_form"
            @submit="login"
            :validation-schema="accountSchema"
            class="p-5 rounded-4 d-flex flex-column justify-content-center"
        >
            <img src="@/assets/images/horizontallogo.png" id="logo_app" class="m-auto mb-5">
            <div class="input-group m-3 d-flex flex-column justify-content-start">
                <label for="msnv" class="form-lable fw-semibold">Mã số nhân viên:</label>
                <Field name="msnv" 
                    type="text" 
                    class="w-100 form-control" 
                    placeholder="Mã số nhân viên" 
                    aria-label="Username" 
                    aria-describedby="basic-addon1" 
                    v-model="account.msnv"
                    model-value=""
                    :disabled="blockLogin"
                />
                <ErrorMessage  name="msnv" class="ms-2 text-danger error_message" />
            </div>
            <div class="input-group m-3 d-flex flex-column justify-content-start">
                <label for="matkhau" class="form-lable fw-semibold">Mật khẩu:</label>
                <Field name="matkhau" 
                    type="password" 
                    id="inputPassword5" 
                    class="w-100 form-control" 
                    aria-describedby="passwordHelpBlock" 
                    placeholder="Nhập mật khẩu"
                    v-model="account.matkhau"
                    model-value=""
                    :disabled="blockLogin"
                />
                <ErrorMessage name="matkhau" class="ms-2 text-danger error_message" />
            </div>
            <span id="server_message" class="ms-2 fw-medium" :class="{'text-danger': hasError, 'text-success': !hasError}">{{ serverMessage }}</span>
            <div class="d-flex justify-content-center">
                <button class="btn btn-primary mt-4" :disabled="blockLogin">Đăng nhập</button>
            </div>
        </form>
    </div>
</template>

<style>
    @import '@/assets/LoginPage/loginpage.css';
</style>