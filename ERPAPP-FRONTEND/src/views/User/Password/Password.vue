<script>
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/User/ProfileHeader.vue';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import Services from '@/services/user.services';

    export default {
        components: {
            AppHeader,
            Navigation,
            Form,
            Field,
            ErrorMessage,
        },

        data () {
            const formSchema = yup.object().shape({
                matkhau: yup.string().required('Nhập mật khẩu hiện tại.').min(8, 'Mật khẩu có ít nhất 8 ký tự.'),
                matkhaumoi: yup.string().required('Nhập mật khẩu mới.').min(8, 'Mật khẩu có ít nhất 8 ký tự.'),
                nhaplaimatkhau: yup.string().required('Nhập lại mật khẩu.').min(8, 'Mật khẩu có ít nhất 8 ký tự.'),
            });

            return {
                formSchema,
                serverMessage: '',
            }
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            resetMessage () {
                setTimeout(() => {
                    this.serverMessage = '';
                }, 2000);
            },

            async changePass (data) {
                try {
                    if (data.matkhaumoi !== data.nhaplaimatkhau) throw 'Mật khẩu không trùng khớp.';
                    const change = await Services.changePass(data);
                    if (change !== 'Success') throw 'Đã xảy ra lỗi, vui lòng thử lại sau.'
                    this.serverMessage = 'Cập nhât thành công. Bạn hãy đăng nhập lại vào tài khoản.'
                    setTimeout(async () => {
                        this.serverMessage = '';
                        const logout = await Services.logout();
                        if (logout === 'Logout success')
                            this.$router.push({name: 'LoginPage'});
                        else throw 'Đăng xuất thất bại.';
                    }, 2000);
                } catch (err) {
                    if ((err === 'Mật khẩu không trùng khớp.') || (err === 'Đã xảy ra lỗi, vui lòng thử lại sau.')) {
                        this.serverMessage = err;
                        this.resetMessage();
                    }
                    console.log(err);
                }
            }
        },

        create () {
            this.checkLogin();
        }
    }
</script>

<template>
    <AppHeader />
    <main>
        <Navigation />
        <h2>Đổi Mật Khẩu</h2>
        <p>{{ serverMessage }}</p>
        <Form name="changepass_form" @submit="changePass" :validation-schema="formSchema">
            <div class="form_field">
                <label for="matkhau">Mật khẩu</label>
                <Field type="password" name="matkhau" id="matkhau" />
                <ErrorMessage name="matkhau" />
            </div>
            <div class="form_field">
                <label for="matkhaumoi">Mật khẩu mới</label>
                <Field type="password" name="matkhaumoi" id="matkhaumoi" />
                <ErrorMessage name="matkhaumoi" />
            </div>
            <div class="form_field">
                <label for="nhaplaimatkhau">Nhập lại mật khẩu</label>
                <Field type="password" name="nhaplaimatkhau" id="nhaplaimatkhau" />
                <ErrorMessage name="nhaplaimatkhau" />
            </div>
            <button type="submit">Cập nhật</button>
        </Form>
    </main>
</template>