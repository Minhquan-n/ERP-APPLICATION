<script>
    import {Form, Field, ErrorMessage} from 'vee-validate';
    import * as yup from 'yup';
    import Services from '@/services/admin.services';

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        props: {
            user: {type: Object, default: {}},
        },

        emits: ['edituser'],

        data () {
            const formSchema = yup.object().shape({
                soBHXH: yup.string()
                    .required('Nhập số BHXH.')
                    .matches(/^[0-9]{10}$/, 'Số BHXH sai định dạng.'),
                soBHYT: yup.string()
                    .required('Nhập số BHYT.'),
                noidkkcb: yup.string()
                    .required('Nhập nơi đăng ký khám chữa bệnh.'),
                luongcoban: yup.string()
                    .required('Nhập lương cơ bản.'),
                phepnam: yup.number()
                    .required('Nhập số ngày nghỉ phép năm.'),
                ngaykyhopdong: yup.string()
                    .required('Chọn ngày ký hợp đồng.'),
                sohdld: yup.string()
                    .required('Nhập số hợp đồng lao động.'),
                loaihopdong: yup.string()
                    .required('Chọn loại hợp đồng.'),
                loaihinhcongviec: yup.number()
                    .moreThan(0, 'Chọn loại hình công việc.'),
                chinhanh: yup.number()
                    .min(1, 'Chọn chi nhánh làm việc.'),
                bophan: yup.number()
                    .min(1, 'Chọn bộ phận làm việc.'),
                chucvu: yup.number()
                    .min(1, 'Chọn chức vụ.'),
                ngaybatdaulamviec: yup.string()
                    .required('Chọn ngày bắt đầu làm việc.'),
            });

            return {
                formSchema,
                branch: [],
                department: [],
                position: [],
                serverMessage: '',
            }
        },

        methods: {
            async setUpForm () {
                try {
                    this.branch = await Services.getBranchList();
                    if (this.branch.length === 0) throw err;
                    this.department = await Services.getDepartmentList();
                    if (this.department.length === 0) throw err;
                    this.position = await Services.getPositionList();
                    if (this.position.length === 0) throw err;
                } catch (err) {
                    console.log(err);
                }
            },

            async editUser (data) {
                try {
                    const ngaybatdau = data.ngaybatdaulamviec.split('/');
                    const ngaykyhopdong = data.ngaykyhopdong.split('/');
                    data.ngaykyhopdong = ngaykyhopdong[2] + '-' + ngaykyhopdong[1] + '-' + ngaykyhopdong[0];
                    data.ngaybatdaulamviec =ngaybatdau[2] + '-' + ngaybatdau[1] + '-' + ngaybatdau[0];
                    const update = await Services.updateUser(this.user.taikhoan.msnv, data);
                    if (update !== 'Success') throw err;
                    this.$emit('edituser', true);
                } catch (err) {
                    console.log(err);
                    this.$emit('edituser', false);
                }
            },
        },

        async created () {
            await this.setUpForm();
        },
    }
</script>

<template>
    <div class="modal-body">
        <Form name="edituserform" @submit="editUser" ref="editform" :validation-schema="formSchema">
            <div class="form_row">
                <p class="row_title"><b>1. Hợp đồng lao động (HDLD)</b></p>
                <div class="form_field small_field">
                    <label class="form-label" for="sohdld">Số HDLD</label>
                    <Field class="form-control" type="text" name="sohdld" id="sohdld" v-model="user.hdld.sohdld" />
                    <ErrorMessage class="text-danger" name="sohdld" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="ngaykyhopdong">Ngày ký HDLD</label>
                    <Field class="form-control" type="text" name="ngaykyhopdong" id="ngaykyhopdong" v-model="user.hdld.ngaykyhopdong" />
                    <ErrorMessage class="text-danger" name="ngaykyhopdong" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="loaihopdong">Loại HDLD</label>
                    <Field class="form-control" type="text" name="loaihopdong" v-model="user.hdld.loaihopdong" :style="{display: 'none'}" />
                    <select class="form-select" name="loaihopdong" id="loaihopdong" v-model="user.hdld.loaihopdong">
                        <option value="">Chọn loại hợp đồng</option>
                        <option value="Không xác định thời hạn">Không xác định thời hạn</option>
                        <option value="Xác định thời hạn">Xác định thời hạn</option>
                    </select>
                    <ErrorMessage class="text-danger" name="loaihopdong" />
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>2. Thông tin bảo hiểm</b></p>
                <div class="form_field medium_field">
                    <label class="form-label" for="soBHXH">Số BHXH</label>
                    <Field class="form-control" type="text" name="soBHXH" id="soBHXH" v-model="user.ttcv.soBHXH" />
                    <ErrorMessage class="text-danger" name="soBHXH" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="soBHYT">Số BHYT</label>
                    <Field class="form-control" type="text" name="soBHYT" id="soBHYT" v-model="user.ttcv.soBHYT" />
                    <ErrorMessage class="text-danger" name="soBHYT" />
                </div>
                <div class="form_field large_field">
                    <label class="form-label" for="noidkkcb">Nơi đăng ký khám chữa bệnh</label>
                    <Field class="form-control" type="text" name="noidkkcb" id="noidkkcb" v-model="user.ttcv.noidkkcb" />
                    <ErrorMessage class="text-danger" name="noidkkcb" />
                </div>
            </div>
            <div class="form_row">
                <p class="row_title"><b>3. Thông tin công việc</b></p>
                <div class="form_field medium_field">
                    <label class="form-label" for="luongcoban">Lương cơ bản</label>
                    <Field class="form-control" type="text" name="luongcoban" id="luongcoban" v-model="user.ttcv.luongcoban" />
                    <ErrorMessage class="text-danger" name="luongcoban" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="phepnam">Nghỉ phép năm</label>
                    <Field class="form-control" type="number" name="phepnam" id="phepnam" v-model="user.ttcv.phepnam" />
                    <ErrorMessage class="text-danger" name="phepnam" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="ngaybatdaulamviec">Ngày bắt đầu làm việc</label>
                    <Field class="form-control" type="text" name="ngaybatdaulamviec" id="ngaybatdaulamviec" v-model="user.ttcv.ngaybatdau" />
                    <ErrorMessage class="text-danger" name="ngaybatdaulamviec" />
                </div>
                <div class="form_field medium_field">
                    <label class="form-label" for="loaihinhcongviec">Loại hình công việc</label>
                    <Field class="form-control" type="number" name="loaihinhcongviec" v-model="user.ttcv.loaihinhcongviec" :style="{display: 'none'}" />
                    <select class="form-select" name="loaihinhcongviec" id="loaihinhcongviec" v-model="user.ttcv.loaihinhcongviec">
                        <option value="0">Không xác định</option>
                        <option value="1">Toàn thời gian</option>
                        <option value="2">Bán thời gian</option>
                    </select>
                    <ErrorMessage class="text-danger" name="loaihinhcongviec" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="chinhanh">Chi nhánh</label>
                    <Field class="form-control" type="number" name="chinhanh" v-model="user.chinhanh.id_chinhanh" :style="{display: 'none'}" />
                    <select class="form-select" name="chinhanh" id="chinhanh" v-model="user.chinhanh.id_chinhanh">
                        <option value="0">Không xác định</option>
                        <option v-for="item in branch" :value="item.id_chinhanh">{{ item.tenchinhanh }}</option>
                    </select>
                    <ErrorMessage class="text-danger" name="chinhanh" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="bophan">Bộ phận</label>
                    <Field class="form-control" type="number" name="bophan" v-model="user.bophan.id_bophan" :style="{display: 'none'}" />
                    <select class="form-select" name="bophan" id="bophan" v-model="user.bophan.id_bophan">
                        <option value="0">Không xác định</option>
                        <option v-for="item in department" :value="item.id_bophan">{{ item.tenbophan }}</option>
                    </select>
                    <ErrorMessage class="text-danger" name="bophan" />
                </div>
                <div class="form_field small_field">
                    <label class="form-label" for="chucvu">Chức vụ</label>
                    <Field class="form-control" type="number" name="chucvu" v-model="user.chucvu.id_chucvu" :style="{display: 'none'}" />
                    <select class="form-select" name="chucvu" id="chucvu" v-model="user.chucvu.id_chucvu">
                        <option value="0">Không xác định</option>
                        <option v-for="item in position" :value="item.id_chucvu">{{ item.tenchucvu }}</option>
                    </select>
                    <ErrorMessage class="text-danger" name="chucvu" />
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
    @import url('@/assets/Admin/Account/accountForm.css');
</style>