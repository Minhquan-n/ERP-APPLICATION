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
                    this.$emit('edit', 'Cập nhật thành công.');
                } catch (err) {
                    console.log(err);
                    this.$emit('edit', 'Cập nhật thất bại.');
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
    <div id="user_avt">
        <img width="400" id="uploadedimage" :src="userInfo.avt_secure_url" />
        <button @click="uploadFile" id="upload_widget" class="cloudinary-button">
            Upload files
        </button>
    </div>
    <Form name="usereditform" @submit="editUser" :validation-schema="formSchema">
        <div class="form_field">
            <label for="hoten">Họ tên</label>
            <Field type="text" name="hoten" id="hoten" v-model="userInfo.hoten" />
            <ErrorMessage name="hoten" />
        </div>
        <div class="form_field">
            <label for="sdt">Số điện thoại</label>
            <Field type="text" name="sdt" id="sdt" v-model="userInfo.sdt" />
            <ErrorMessage name="sdt" />
        </div>
        <div class="form_field">
            <label for="email">Email</label>
            <Field type="text" name="email" id="email" v-model="userInfo.email" />
            <ErrorMessage name="email" />
        </div>
        <div class="form_field">
            <label for="gioitinh">Giới tính</label>
            <select name="gioitinh" id="gioitinh" v-model="userInfo.gioitinh">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
            <Field type="text" name="gioitinh" v-model="userInfo.gioitinh" :style="{display: 'none'}" />
            <ErrorMessage name="gioitinh" />
        </div>
        <div class="form_field">
            <label for="ngaysinh">Ngày sinh</label>
            <Field type="date" name="ngaysinh" id="ngaysinh" v-model="userInfo.ngaysinh" />
            <ErrorMessage name="ngaysinh" />
        </div>
        <div class="form_field">
            <label for="dantoc">Dân tộc</label>
            <select name="dantoc" id="dantoc" v-model="userInfo.dantoc">
                <option v-for="item in nationlist" :value="item.id_dantoc">{{ item.tendantoc }}</option>
            </select>
            <Field type="number" name="dantoc" v-model="userInfo.dantoc" :style="{display: 'none'}" />
            <ErrorMessage name="dantoc" />
        </div>
        <div class="form_field">
            <label for="cccd">CCCD</label>
            <Field type="text" name="cccd" id="cccd" v-model="userInfo.cccd" />
            <ErrorMessage name="cccd" />
        </div>
        <div class="form_field">
            <label for="ngaycap_cccd">Ngày cấp CCCD</label>
            <Field type="date" name="ngaycap_cccd" id="ngaycap_cccd" v-model="userInfo.ngaycap_cccd" />
            <ErrorMessage name="ngaycap_cccd" />
        </div>
        <div class="form_field">
            <label for="noicap_cccd">Nơi cấp CCCD</label>
            <Field type="text" name="noicap_cccd" id="noicap_cccd" v-model="userInfo.noicap_cccd" />
            <ErrorMessage name="noicap_cccd" />
        </div>
        <div class="form_field">
            <label for="trinhdo">Trình độ</label>
            <Field type="text" name="trinhdo" id="trinhdo" v-model="userInfo.trinhdo" />
        </div>
        <div class="form_field">
            <label for="stk">Số tài khoản</label>
            <Field type="text" name="stk" id="stk" v-model="userInfo.stk" />
            <ErrorMessage name="stk" />
        </div>
        <div class="form_field">
            <label for="tentk">Tên tài khoản</label>
            <Field type="text" name="tentk" id="tentk" v-model="userInfo.tentk" />
            <ErrorMessage name="tentk" />
        </div>
        <div class="form_field">
            <label for="tenNH">Tên ngân hàng</label>
            <Field type="text" name="tenNH" id="tenNH" v-model="userInfo.tenNH" />
            <ErrorMessage name="tenNH" />
        </div>
        <div class="form_field">
            <label for="dclh_sonha">Số nhà</label>
            <Field type="text" name="dclh_sonha" id="dclh_sonha" v-model="userInfo.dclh_sonha" />
            <ErrorMessage name="dclh_sonha" />
        </div>
        <div class="form_field">
            <label for="dclh_tinhthanh">Tỉnh, thành</label>
            <select name="dclh_tinhthanh" id="dclh_tinhthanh" v-model="userInfo.dclh_tinhthanh" @change="getDistrict">
                <option v-for="item in provincelist" :value="item.id_tinhthanh">{{ item.tentinhthanh }}</option>
            </select>
            <Field type="text" name="dclh_tinhthanh" v-model="userInfo.dclh_tinhthanh" :style="{display: 'none'}" />
            <ErrorMessage name="dclh_tinhthanh" />
        </div>
        <div class="form_field">
            <label for="dclh_quanhuyen">Quận, huyện</label>
            <select name="dclh_quanhuyen" id="dclh_quanhuyen" v-model="userInfo.dclh_quanhuyen" @change="getWard">
                <option v-for="item in districtlist" :value="item.id_quanhuyen">{{ item.tenquanhuyen }}</option>
            </select>
            <Field type="text" name="dclh_quanhuyen" v-model="userInfo.dclh_quanhuyen" :style="{display: 'none'}" />
            <ErrorMessage name="dclh_quanhuyen" />
        </div>
        <div class="form_field">
            <label for="dclh_phuongxa">Phường, xã</label>
            <select name="dclh_phuongxa" id="dclh_phuongxa" v-model="userInfo.dclh_phuongxa">
                <option v-for="item in wardlist" :value="item.id_phuongxa">{{ item.tenphuongxa }}</option>
            </select>
            <Field type="text" name="dclh_phuongxa" v-model="userInfo.dclh_phuongxa" :style="{display: 'none'}" />
            <ErrorMessage name="dclh_phuongxa" />
        </div>
        <div class="form_field">
            <label for="hoten_nguoithan">Họ tên người thân</label>
            <Field type="text" name="hoten_nguoithan" id="hoten_nguoithan" v-model="userInfo.hoten_nguoithan" />
        </div>
        <div class="form_field">
            <label for="sdt_nguoithan">Số điện thoại</label>
            <Field type="text" name="sdt_nguoithan" id="sdt_nguoithan" v-model="userInfo.sdt_nguoithan" />
        </div>
        <div class="form_field">
            <label for="mqh_nguoithan">Mối quan hệ</label>
            <Field type="text" name="mqh_nguoithan" id="mqh_nguoithan" v-model="userInfo.mqh_nguoithan" />
        </div>
        <button type="submit">Cập nhật</button>
    </Form>
</template>