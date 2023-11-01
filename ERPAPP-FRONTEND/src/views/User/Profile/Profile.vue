<script>
    import $cookie from 'vue-cookies';
    import Services from '@/services/user.services';
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/User/ProfileHeader.vue';
    import UserForm from '@/components/User/PersonalEditForm.vue';

    export default {
        components: {
            AppHeader,
            Navigation,
            UserForm,
        },

        data () {
            return {
                user: {},
                personal: {},
                editform: false,

                serverMessage: '',
            }
        },

        methods: {
            resetMessage () {
                setTimeout(() => {
                    this.serverMessage = '';
                }, 2000);
            },

            // Cac ham set up trang ho so
            async getUserInfo () {
                try {
                    this.user = await Services.showUserInfo();
                } catch (err) {
                    this.serverMessage = 'Đã xảy ra lỗi, vui lòng tải lại trang.';
                    console.log(err);
                    this.resetMessage();
                }
            },

            extractPersonalInfo () {
                const ngaysinh =  (this.user.ttcn.ngaysinh) ? (this.user.ttcn.ngaysinh.split('/')[2] + '-' + this.user.ttcn.ngaysinh.split('/')[1] + '-' + this.user.ttcn.ngaysinh.split('/')[0]) : null;
                const ngaycap_cccd = (this.user.ttcn.ngaycap_cccd) ? (this.user.ttcn.ngaycap_cccd.split('/')[2] + '-' + this.user.ttcn.ngaycap_cccd.split('/')[1] + '-' + this.user.ttcn.ngaycap_cccd.split('/')[0]) : null;
                this.personal = {
                    sdt: this.user.taikhoan.sdt,
                    email: this.user.taikhoan.email,
                    hoten: this.user.ttcn.hoten,
                    gioitinh: this.user.ttcn.gioitinh,
                    ngaysinh: ngaysinh,
                    dantoc: this.user.ttcn.dantoc,
                    cccd: this.user.ttcn.cccd,
                    ngaycap_cccd: ngaycap_cccd,
                    noicap_cccd: this.user.ttcn.noicap_cccd,
                    trinhdo: this.user.ttcn.trinhdo,
                    stk: this.user.ttcn.stk,
                    tenNH: this.user.ttcn.tenNH,
                    tentk: this.user.ttcn.tentk,
                    dclh_sonha: this.user.ttcn.dclh_sonha,
                    dclh_tinhthanh: this.user.ttcn.dclh_tinhthanh,
                    dclh_quanhuyen: this.user.ttcn.dclh_quanhuyen,
                    dclh_phuongxa: this.user.ttcn.dclh_phuongxa,
                    hoten_nguoithan: this.user.ttcn.hoten_nguoithan,
                    sdt_nguoithan: this.user.ttcn.sdt_nguoithan,
                    mqh_nguoithan: this.user.ttcn.mqh_nguoithan,
                    avt_secure_url: this.user.avt.avt_secure_url,
                    avt_public_id: this.user.avt.avt_public_id,
                    avt_format: this.user.avt.avt_format
                };
            },

            async setUppage () {
                await this.getUserInfo();
                this.extractPersonalInfo();
            },

            // Ham mo form chinh sua thong tin ca nhan
            editForm () {
                this.editform = (this.editform) ? false : true;
            },

            editUser (message) {
                this.serverMessage = message;
                setTimeout(() => {
                    this.serverMessage = '';
                    this.$router.go(0);
                }, 2000);
            },
        },

        created () {
            this.setUppage();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <Navigation />
        <h2>Hồ sơ nhân viên</h2>
        <button @click="editForm">Cập nhật hồ sơ</button>
        <p>{{ serverMessage }}</p>
        <div v-for="item in user">{{ item }}<br></div>
        <div id="edit_form" :style="{display: (editform) ? 'block': 'none'}">
            <UserForm :user-info="personal" @edit="editUser" />
        </div>
    </main>
</template>