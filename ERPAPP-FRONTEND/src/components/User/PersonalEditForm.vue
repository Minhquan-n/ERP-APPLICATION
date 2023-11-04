<script>
    import {Form, Field, ErrorMessage} from 'vee-validate';
    import * as yup from'yup';
    import AdmimService from '@/services/admin.services';
    import UserService from '@/services/user.services';

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;    

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        props: {
            userInfo: {type: Object, default: {}},
        },

        emits: ['edit'],

        data () {
            const formSchema = yup.object().shape({
                sdt: yup.string().required('Nhập số điện thoại.').matches(/^0[1-9]\d{8}$/g, 'Số điện thoại sai định dạng.'),
                email: yup.string().required('Nhập email.').matches(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Email không đúng định dạng.'),
                hoten: yup.string().required('Nhập họ tên.'),
                gioitinh: yup.string().required('Chọn giới tính.'),
                ngaysinh: yup.string().required('Chọn ngày sinh.'),
                dantoc: yup.number().required('Chọn dân tộc.'),
                cccd: yup.string().required('Nhập số CCCD.').matches(/0[0-9]{11}/,'Số CCCD sai định dạng.'),
                ngaycap_cccd: yup.string().required('Chọn ngày cấp CCCD.'),
                noicap_cccd: yup.string().required('Nhập nơi cấp CCCD.'),
                stk: yup.string().required('Nhập số tài khoản ngân hàng').min(9, 'Số tài khoản có ít nhất 9 ký tự số.').max(15, 'Số tài khoản có nhiều nhất 15 ký tự số.'),
                tenNH: yup.string().required('Nhập tên ngân hàng.'),
                tentk: yup.string().required('Nhập tên tài khoản.'),
                dclh_sonha: yup.string().required('Nhập số nhà, tên đường, khu vực.'),
                dclh_tinhthanh: yup.string().required('Chọn tỉnh thành.'),
                dclh_quanhuyen: yup.string().required('Chọn quận huyện.'),
                dclh_phuongxa: yup.string().required('Chọn phường xã.'),
            });

            return {
                nationlist: [],
                provincelist: [],
                districtlist: [],
                wardlist: [],
                formSchema,
            }
        },

        methods: {
            async getProvince () {
                this.provincelist = await AdmimService.getProvinceList();
            },

            async getDistrict() {
                const data = {tinhthanh: this.userInfo.dclh_tinhthanh}
                this.districtlist = await AdmimService.getDistrictList(data);
            },

            async getWard () {
                const data = {tinhthanh: this.userInfo.dclh_tinhthanh, quanhuyen: this.userInfo.dclh_quanhuyen};
                this.wardlist = await AdmimService.getWardList(data);
            },

            async getNation () {
                this.nationlist = await AdmimService.getEthnicList();
            },

            async setUpForm () {
                await this.getNation();
                await this.getProvince();
                await this.getDistrict();
                await this.getWard();
            },

            async editUser () {
                try {
                    const edit = await UserService.updateUserInfo(this.userInfo);
                    if (edit !== 'Success') throw err;
                    this.$emit('edit', true);
                } catch (err) {
                    console.log(err);
                    this.$emit('edit', false);
                }
            },

            uploadFile () {
                const myWidget = cloudinary.createUploadWidget({
                    cloudName: cloudName,
                    uploadPreset: uploadPreset,
                    },
                    (error, result) => {
                        if (!error && result && result.event === "success") {
                            this.userInfo.avt_secure_url = result.info.secure_url;
                            this.userInfo.avt_public_id = result.info.public_id;
                            this.userInfo.avt_format = result.info.fomat;
                        }
                    }
                );
                myWidget.open();
            },
        },

        created () {
            this.setUpForm();
        },
    }
</script>

<template>
    <div class="modal-body">
        <Form name="usereditform" @submit="editUser" :validation-schema="formSchema">
            <div id="basic_info_row">
                <div id="user_avt">
                    <img id="uploadedimage" :src="userInfo.avt_secure_url" />
                    <button type="button" @click="uploadFile" id="upload_widget" class="cloudinary-button">
                        Upload files
                    </button>
                </div>
                <div id="user_basic_info">
                    <p class="row_title"><b>1. Thông tin cơ bản</b></p>
                    <div class="form_field large_field">
                        <label class="form-label" for="hoten">Họ tên</label>
                        <Field class="form-control" type="text" name="hoten" id="hoten" v-model="userInfo.hoten" />
                        <ErrorMessage class="text-danger" name="hoten" />
                    </div>
                    <div class="form_field large_field">
                        <label class="form-label" for="sdt">Số điện thoại</label>
                        <Field class="form-control" type="text" name="sdt" id="sdt" v-model="userInfo.sdt" />
                        <ErrorMessage class="text-danger" name="sdt" />
                    </div>
                    <div class="form_field large_field">
                        <label class="form-label" for="email">Email</label>
                        <Field class="form-control" type="text" name="email" id="email" v-model="userInfo.email" />
                        <ErrorMessage class="text-danger" name="email" />
                    </div>
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>2. Thông tin cá nhân</b></p>
                <div class="form_field small_field">
                    <label class="form-label" for="gioitinh">Giới tính</label>
                    <select class="form-select" name="gioitinh" id="gioitinh" v-model="userInfo.gioitinh">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <Field class="form-control" type="text" name="gioitinh" v-model="userInfo.gioitinh" :style="{display: 'none'}" />
                    <ErrorMessage class="text-danger" name="gioitinh" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="ngaysinh">Ngày sinh</label>
                    <Field class="form-control" type="date" name="ngaysinh" id="ngaysinh" v-model="userInfo.ngaysinh" />
                    <ErrorMessage class="text-danger" name="ngaysinh" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="dantoc">Dân tộc</label>
                    <select class="form-select" name="dantoc" id="dantoc" v-model="userInfo.dantoc">
                        <option v-for="item in nationlist" :value="item.id_dantoc">{{ item.tendantoc }}</option>
                    </select>
                    <Field class="form-control" type="number" name="dantoc" v-model="userInfo.dantoc" :style="{display: 'none'}" />
                    <ErrorMessage class="text-danger" name="dantoc" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="cccd">CCCD</label>
                    <Field class="form-control" type="text" name="cccd" id="cccd" v-model="userInfo.cccd" />
                    <ErrorMessage class="text-danger" name="cccd" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="ngaycap_cccd">Ngày cấp CCCD</label>
                    <Field class="form-control" type="date" name="ngaycap_cccd" id="ngaycap_cccd" v-model="userInfo.ngaycap_cccd" />
                    <ErrorMessage class="text-danger" name="ngaycap_cccd" />
                </div>
                <div class="form_field large_field">
                    <label class="form-label" for="noicap_cccd">Nơi cấp CCCD</label>
                    <Field class="form-control" type="text" name="noicap_cccd" id="noicap_cccd" v-model="userInfo.noicap_cccd" />
                    <ErrorMessage class="text-danger" name="noicap_cccd" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="trinhdo">Trình độ</label>
                    <Field class="form-control" type="text" name="trinhdo" id="trinhdo" v-model="userInfo.trinhdo" />
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>3. Thông tin số tài khoản</b></p>
                <div class="form_field medium_field">
                    <label class="form-label" for="stk">Số tài khoản</label>
                    <Field class="form-control" type="text" name="stk" id="stk" v-model="userInfo.stk" />
                    <ErrorMessage class="text-danger" name="stk" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="tentk">Tên tài khoản</label>
                    <Field class="form-control" type="text" name="tentk" id="tentk" v-model="userInfo.tentk" />
                    <ErrorMessage class="text-danger" name="tentk" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="tenNH">Tên ngân hàng</label>
                    <Field class="form-control" type="text" name="tenNH" id="tenNH" v-model="userInfo.tenNH" />
                    <ErrorMessage class="text-danger" name="tenNH" />
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>4. Địa chỉ liên hệ</b></p>
                <div class="form_field large_field">
                    <label class="form-label" for="dclh_sonha">Số nhà</label>
                    <Field class="form-control" type="text" name="dclh_sonha" id="dclh_sonha" v-model="userInfo.dclh_sonha" />
                    <ErrorMessage class="text-danger" name="dclh_sonha" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="dclh_tinhthanh">Tỉnh, thành</label>
                    <select class="form-select" name="dclh_tinhthanh" id="dclh_tinhthanh" v-model="userInfo.dclh_tinhthanh" @change="getDistrict">
                        <option v-for="item in provincelist" :value="item.id_tinhthanh">{{ item.tentinhthanh }}</option>
                    </select>
                    <Field class="form-control" type="text" name="dclh_tinhthanh" v-model="userInfo.dclh_tinhthanh" :style="{display: 'none'}" />
                    <ErrorMessage class="text-danger" name="dclh_tinhthanh" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="dclh_quanhuyen">Quận, huyện</label>
                    <select class="form-select" name="dclh_quanhuyen" id="dclh_quanhuyen" v-model="userInfo.dclh_quanhuyen" @change="getWard">
                        <option v-for="item in districtlist" :value="item.id_quanhuyen">{{ item.tenquanhuyen }}</option>
                    </select>
                    <Field class="form-control" type="text" name="dclh_quanhuyen" v-model="userInfo.dclh_quanhuyen" :style="{display: 'none'}" />
                    <ErrorMessage class="text-danger" name="dclh_quanhuyen" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="dclh_phuongxa">Phường, xã</label>
                    <select class="form-select" name="dclh_phuongxa" id="dclh_phuongxa" v-model="userInfo.dclh_phuongxa">
                        <option v-for="item in wardlist" :value="item.id_phuongxa">{{ item.tenphuongxa }}</option>
                    </select>
                    <Field class="form-control" type="text" name="dclh_phuongxa" v-model="userInfo.dclh_phuongxa" :style="{display: 'none'}" />
                    <ErrorMessage class="text-danger" name="dclh_phuongxa" />
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>5. Thông tin người thân</b></p>
                <div class="form_field medium_field">
                    <label class="form-label" for="hoten_nguoithan">Họ tên người thân</label>
                    <Field class="form-control" type="text" name="hoten_nguoithan" id="hoten_nguoithan" v-model="userInfo.hoten_nguoithan" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="sdt_nguoithan">Số điện thoại</label>
                    <Field class="form-control" type="text" name="sdt_nguoithan" id="sdt_nguoithan" v-model="userInfo.sdt_nguoithan" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="mqh_nguoithan">Mối quan hệ</label>
                    <Field class="form-control" type="text" name="mqh_nguoithan" id="mqh_nguoithan" v-model="userInfo.mqh_nguoithan" />
                </div>
            </div>
            <div class="form_button">
                <button type="button" class="form_btn btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="form_btn btn btn-primary">Cập nhật</button>
            </div>
        </Form>
    </div>
</template>

<style>
    @import url('@/assets/User/Profile/profileForm.css');
</style>