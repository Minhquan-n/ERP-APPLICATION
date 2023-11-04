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
                inform: false,
                success: false,
            }
        },

        methods: {
            // Kiem tra dang nhap
            checkLogin () {
                if($cookie.get('loggedin') !== 'true') this.$router.push({name: 'LoginPage'});
            },

            resetMessage () {
                setTimeout(() => {
                    this.inform = false;
                    this.serverMessage = '';
                }, 5000);
            },

            async changePass (data) {
                try {
                    if (data.matkhaumoi !== data.nhaplaimatkhau) throw 'Mật khẩu không trùng khớp.';
                    const change = await Services.changePass(data);
                    if (change !== 'Success') throw 'Đã xảy ra lỗi, vui lòng thử lại sau.'
                    this.serverMessage = 'Cập nhât thành công. Bạn hãy đăng nhập lại vào tài khoản.';
                    this.inform = true;
                    this.success = true;
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
                        this.inform = true;
                        this.success = false;
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
        <div class="main_content">
            <h1>Đổi Mật Khẩu</h1>
            <Form name="changepass_form" @submit="changePass" :validation-schema="formSchema">
                <div class="form_field">
                    <label class="form-label" for="matkhau">Mật khẩu</label>
                    <Field class="form-control" type="password" name="matkhau" id="matkhau" />
                    <ErrorMessage class="text-danger" name="matkhau" />
                </div>
                <div class="form_field">
                    <label class="form-label" for="matkhaumoi">Mật khẩu mới</label>
                    <Field class="form-control" type="password" name="matkhaumoi" id="matkhaumoi" />
                    <ErrorMessage class="text-danger" name="matkhaumoi" />
                </div>
                <div class="form_field">
                    <label class="form-label" for="nhaplaimatkhau">Nhập lại mật khẩu</label>
                    <Field class="form-control" type="password" name="nhaplaimatkhau" id="nhaplaimatkhau" />
                    <ErrorMessage class="text-danger" name="nhaplaimatkhau" />
                </div>
                <div class="form_button">
                    <button type="reset" class="form_btn btn btn-danger">Hủy</button>
                    <button type="submit" class="form_btn btn btn-primary">Cập nhật</button>
                </div>
            </Form>
            <div class="inform alert" :class="[(success) ? 'alert-success' : 'alert-danger']" :style="{display: (inform) ? 'flex' : 'none'}">
                <div>{{ serverMessage }}</div>
            </div>
        </div>
    </main>
</template>

<style>
    @import url('@/assets/User/Profile/profilePage.css');

    form {
        width: 35%;
    }
</style>